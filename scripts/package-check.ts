import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  packReleaseArchive,
  packShadcnArchive,
  packMuiArchive,
} from '../tooling/release/pack.js';
import {
  parseDistributionManifest,
  parseShadcnDistributionManifest,
} from '../tooling/release/distribution.js';
import { verifyHeadlessInstall } from '../tooling/package/headless.js';
import { buildInstalledBootstrap } from '../tooling/package/bootstrap.js';
import { exerciseInstalledBootstrap } from '../tooling/package/browser.js';
import { INSTALLED_COMPILER_POLICY } from '../tooling/package/compiler-policy.js';

import { installedTypeDependencies } from '../tooling/package/development-types.js';
import { verifyMaterialInstall } from '../tooling/package/material.js';

const root = process.cwd();
const temporary = await mkdtemp(join(tmpdir(), 'reacd-package-'));
const compiler = resolve(root, 'node_modules/typescript/bin/tsc');
const fixtureRoot = resolve(root, 'tooling/package/fixtures');

async function fixture(name: string) {
  return readFile(join(fixtureRoot, name), 'utf8');
}
const options = INSTALLED_COMPILER_POLICY;

try {
  const archive = packReleaseArchive(root);
  const adapterArchive = packShadcnArchive(root);
  verifyHeadlessInstall(root, archive, temporary);
  const modules = join(temporary, 'node_modules');
  const installed = join(modules, '@fastsprout/reacd');
  await mkdir(installed, { recursive: true });
  execFileSync('tar', ['-xf', archive, '-C', installed, '--strip-components=1']);
  const manifest: unknown = JSON.parse(
    await readFile(join(installed, 'package.json'), 'utf8'),
  );
  const metadata = parseDistributionManifest(manifest);
  const adapterPath = join(modules, '@fastsprout/reacd-shadcn');
  await mkdir(adapterPath, { recursive: true });
  execFileSync('tar', [
    '-xf',
    adapterArchive,
    '-C',
    adapterPath,
    '--strip-components=1',
  ]);
  const adapterInput: unknown = JSON.parse(
    await readFile(join(adapterPath, 'package.json'), 'utf8'),
  );
  const adapter = parseShadcnDistributionManifest(adapterInput);
  const dependencies = new Set([
    ...Object.keys(metadata.dependencies),
    ...Object.keys(adapter.dependencies),
    ...Object.keys(metadata.peerDependencies),
    '@types',
  ]);
  for (const name of dependencies) {
    const target = join(modules, name);
    await mkdir(dirname(target), { recursive: true });
    await symlink(resolve(root, 'node_modules', name), target, 'dir');
  }
  await writeFile(join(temporary, 'package.json'), '{"type":"module"}\n');
  await writeFile(join(temporary, 'consumer.tsx'), await fixture('consumer.tsx.txt'));
  await writeFile(
    join(temporary, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: options,
      files: ['consumer.tsx'],
    }),
  );
  execFileSync(process.execPath, [compiler, '-p', temporary], { stdio: 'inherit' });
  const negatives = [
    { name: 'native', diagnostic: /TS2745[\s\S]*never/ },
    { name: 'style', diagnostic: /TS2322[\s\S]*style/ },
    { name: 'value', diagnostic: /TS2322[\s\S]*number/ },
    { name: 'private', diagnostic: /TS2307[\s\S]*@fastsprout\/reacd\/dist/ },
    { name: 'bootstrap-escape', diagnostic: /TS2339[\s\S]*render/ },
    { name: 'runtime-state', diagnostic: /TS2307[\s\S]*adapter-runtime/ },
  ];
  for (const { name, diagnostic } of negatives) {
    await writeFile(join(temporary, `${name}.tsx`), await fixture(`${name}.tsx.txt`));
    await writeFile(
      join(temporary, 'negative.json'),
      JSON.stringify({
        compilerOptions: { ...options, noEmit: true },
        files: [`${name}.tsx`],
      }),
    );
    const result = spawnSync(process.execPath, [compiler, '-p', 'negative.json'], {
      cwd: temporary,
      encoding: 'utf8',
    });
    assert.equal(result.status, 1, `${name} must fail compilation.`);
    assert.match(result.stdout + result.stderr, diagnostic);
  }
  await writeFile(join(temporary, 'runtime.mjs'), await fixture('runtime.mjs.txt'));
  execFileSync(process.execPath, ['runtime.mjs'], { cwd: temporary, stdio: 'inherit' });
  const isolated = await mkdtemp(join(tmpdir(), 'reacd-installed-'));
  try {
    const clean = join(isolated, 'clean-consumer');
    await mkdir(clean);
    await writeFile(
      join(clean, 'package.json'),
      JSON.stringify({
        private: true,
        type: 'module',
        devDependencies: installedTypeDependencies(root),
        dependencies: {
          '@fastsprout/reacd': pathToFileURL(archive).href,
          '@fastsprout/reacd-shadcn': pathToFileURL(adapterArchive).href,
        },
      }),
    );
    execFileSync(
      'npm',
      [
        'install',
        '--include=dev',
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
        '--package-lock=false',
        '--registry=https://registry.npmjs.org/',
      ],
      { cwd: clean, stdio: 'inherit' },
    );
    await writeFile(join(clean, 'installed.mjs'), await fixture('installed.mjs.txt'));
    execFileSync(process.execPath, ['installed.mjs'], { cwd: clean, stdio: 'inherit' });
    buildInstalledBootstrap(root, clean);
    await exerciseInstalledBootstrap(clean);
    const materialArchive = packMuiArchive(root);
    await verifyMaterialInstall(root, archive, materialArchive, isolated);
  } finally {
    await rm(isolated, { recursive: true, force: true });
  }
} finally {
  await rm(temporary, { recursive: true, force: true });
}
console.log('Packed TSX, negative fixtures, SSR, state, and exports passed.');

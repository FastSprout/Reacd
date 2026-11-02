import { installedTypeDependencies } from './development-types.js';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { MaterialPackageArchives } from './archives.js';
import { INSTALLED_COMPILER_POLICY } from './compiler-policy.js';
import { buildInstalledBootstrap } from './bootstrap.js';
import { exerciseInstalledBootstrap } from './browser.js';

export async function verifyMaterialInstall(
  root: string,
  archives: MaterialPackageArchives,
  parent: string,
): Promise<void> {
  const consumer = join(parent, 'material-consumer');
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({
      private: true,
      type: 'module',
      devDependencies: installedTypeDependencies(root),
      overrides: { '@fastsprout/reacd-shadcn': pathToFileURL(archives.shadcn).href },
      dependencies: {
        '@fastsprout/reacd': pathToFileURL(archives.engine).href,
        '@fastsprout/reacd-mui': pathToFileURL(archives.mui).href,
      },
    }),
  );
  const execution = { cwd: consumer, stdio: 'inherit' } as const;
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
    execution,
  );
  assert(
    existsSync(join(consumer, 'node_modules/@fastsprout/reacd-shadcn')),
    'The engine default SDK must be installed beside the explicit Material adapter.',
  );
  const fixtureRoot = resolve(root, 'tooling/package/fixtures');
  for (const [source, target] of [
    ['consumer.tsx.txt', 'consumer.tsx'],
    ['runtime.mjs.txt', 'runtime.mjs'],
    ['installed.mjs.txt', 'installed.mjs'],
  ] as const) {
    const content = readFileSync(join(fixtureRoot, source), 'utf8')
      .replaceAll('@fastsprout/reacd-shadcn', '@fastsprout/reacd-mui')
      .replaceAll('shadcnAdapter', 'muiAdapter')
      .replaceAll('shadcn-ui', 'material-ui')
      .replaceAll('<ReacdProvider>', '<ReacdProvider adapter={muiAdapter}>')
      .replaceAll(
        '<GenerativeUI document',
        '<GenerativeUI adapter={muiAdapter} document',
      );
    writeFileSync(join(consumer, target), content);
  }
  writeFileSync(
    join(consumer, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: INSTALLED_COMPILER_POLICY,
      files: ['consumer.tsx'],
    }),
  );
  execFileSync(
    process.execPath,
    [resolve(root, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json'],
    execution,
  );
  execFileSync(process.execPath, ['runtime.mjs'], execution);
  execFileSync(process.execPath, ['installed.mjs'], execution);
  writeFileSync(
    join(consumer, 'independence.mjs'),
    "import assert from 'node:assert/strict';\n" +
      "assert.ok(import.meta.resolve('@fastsprout/reacd-shadcn'));\n",
  );
  execFileSync(process.execPath, ['independence.mjs'], execution);
  buildInstalledBootstrap(root, consumer, 'mui');
  await exerciseInstalledBootstrap(consumer, 'mui');
}

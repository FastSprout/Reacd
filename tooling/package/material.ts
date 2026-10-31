import { installedTypeDependencies } from './development-types.js';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { INSTALLED_COMPILER_POLICY } from './compiler-policy.js';
import { buildInstalledBootstrap } from './bootstrap.js';
import { exerciseInstalledBootstrap } from './browser.js';

export async function verifyMaterialInstall(
  root: string,
  engineArchive: string,
  materialArchive: string,
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
      dependencies: {
        '@fastsprout/reacd': pathToFileURL(engineArchive).href,
        '@fastsprout/reacd-mui': pathToFileURL(materialArchive).href,
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
    !existsSync(join(consumer, 'node_modules/@fastsprout/reacd-shadcn')),
    'Material UI must install without the shadcn adapter.',
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
      .replaceAll('shadcn-ui', 'material-ui');
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
    "import { createRequire } from 'node:module';\n" +
      "import assert from 'node:assert/strict';\n" +
      'const require = createRequire(import.meta.url);\n' +
      "assert.throws(() => require.resolve('@fastsprout/reacd-shadcn'), " +
      "{ code: 'MODULE_NOT_FOUND' });\n",
  );
  execFileSync(process.execPath, ['independence.mjs'], execution);
  buildInstalledBootstrap(root, consumer, 'mui');
  await exerciseInstalledBootstrap(consumer);
}

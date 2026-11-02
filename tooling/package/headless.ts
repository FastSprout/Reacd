import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { DefaultPackageArchives } from './archives.js';

export function verifyHeadlessInstall(
  root: string,
  archives: DefaultPackageArchives,
  parent: string,
): void {
  const consumer = join(parent, 'headless-consumer');
  mkdirSync(consumer);
  writeFileSync(
    join(consumer, 'package.json'),
    JSON.stringify({
      private: true,
      type: 'module',
      dependencies: { '@fastsprout/reacd': pathToFileURL(archives.engine).href },
      overrides: { '@fastsprout/reacd-shadcn': pathToFileURL(archives.shadcn).href },
    }),
  );
  execFileSync(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--package-lock=false',
      '--registry=https://registry.npmjs.org/',
    ],
    { cwd: consumer, stdio: 'inherit' },
  );
  writeFileSync(
    join(consumer, 'headless.mjs'),
    readFileSync(join(root, 'tooling/package/fixtures/headless.mjs.txt')),
  );
  execFileSync(process.execPath, ['headless.mjs'], { cwd: consumer, stdio: 'inherit' });
}

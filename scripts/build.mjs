import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { rmSync } from 'node:fs';

const compiler = fileURLToPath(
  new URL('../node_modules/typescript/bin/tsc', import.meta.url),
);
const vite = fileURLToPath(
  new URL('../node_modules/vite/bin/vite.js', import.meta.url),
);

rmSync(new URL('../dist/', import.meta.url), { recursive: true, force: true });
execFileSync(process.execPath, [compiler, '-p', 'tsconfig.build.json'], {
  stdio: 'inherit',
});
execFileSync(process.execPath, [vite, 'build', '--config', 'vite.styles.config.ts'], {
  stdio: 'inherit',
});
execFileSync(process.execPath, [vite, 'build'], { stdio: 'inherit' });
execFileSync(
  process.execPath,
  ['--import', 'tsx', fileURLToPath(new URL('./bundle-check.ts', import.meta.url))],
  { stdio: 'inherit' },
);

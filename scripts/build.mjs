import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { copyFileSync, rmSync } from 'node:fs';

const compiler = fileURLToPath(
  new URL('../node_modules/typescript/bin/tsc', import.meta.url),
);
const vite = fileURLToPath(
  new URL('../node_modules/vite/bin/vite.js', import.meta.url),
);

rmSync(new URL('../dist/', import.meta.url), { recursive: true, force: true });
rmSync(new URL('../packages/shadcn/dist/', import.meta.url), {
  recursive: true,
  force: true,
});
rmSync(new URL('../packages/mui/dist/', import.meta.url), {
  recursive: true,
  force: true,
});
execFileSync(process.execPath, [compiler, '-p', 'tsconfig.build.json'], {
  stdio: 'inherit',
});
execFileSync(
  process.execPath,
  [compiler, '-p', 'packages/shadcn/tsconfig.build.json'],
  {
    stdio: 'inherit',
  },
);
execFileSync(process.execPath, [compiler, '-p', 'packages/mui/tsconfig.build.json'], {
  stdio: 'inherit',
});
for (const adapter of ['shadcn', 'mui']) {
  for (const [source, target] of [
    ['styles.ts', 'styles.js'],
    ['styles-contract.ts', 'styles-contract.d.ts'],
  ]) {
    copyFileSync(
      new URL(`../src/adapter/${adapter}/${source}`, import.meta.url),
      new URL(`../packages/${adapter}/dist/${target}`, import.meta.url),
    );
  }
}
execFileSync(process.execPath, [vite, 'build', '--config', 'vite.styles.config.ts'], {
  stdio: 'inherit',
});
execFileSync(
  process.execPath,
  [vite, 'build', '--config', 'vite.mui-styles.config.ts'],
  { stdio: 'inherit' },
);
execFileSync(
  process.execPath,
  [vite, 'build', '--config', 'vite.conformance.config.ts'],
  { stdio: 'inherit' },
);
execFileSync(
  process.execPath,
  ['--import', 'tsx', fileURLToPath(new URL('./bundle-check.ts', import.meta.url))],
  { stdio: 'inherit' },
);
const EXAMPLE_MODES = ['counter', 'form', 'dashboard'];
for (const mode of EXAMPLE_MODES) {
  execFileSync(
    process.execPath,
    [vite, 'build', '--config', 'vite.examples.config.ts', '--mode', mode],
    { stdio: 'inherit' },
  );
}

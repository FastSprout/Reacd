import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const compiler = fileURLToPath(
  new URL('../node_modules/typescript/bin/tsc', import.meta.url),
);
for (const project of [
  'tsconfig.contracts.json',
  'packages/shadcn/tsconfig.build.json',
  'packages/mui/tsconfig.build.json',
  'tsconfig.build.json',
  '.',
  'tooling/conformance',
  'tooling/site/app',
  'docs/examples',
  'examples',
]) {
  execFileSync(process.execPath, [compiler, '-p', project], { stdio: 'inherit' });
}

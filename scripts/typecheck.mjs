import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const compiler = fileURLToPath(
  new URL('../node_modules/typescript/bin/tsc', import.meta.url),
);
for (const project of [
  'tsconfig.build.json',
  '.',
  'tooling/conformance',
  'docs/examples',
  'examples',
]) {
  execFileSync(process.execPath, [compiler, '-p', project], { stdio: 'inherit' });
}

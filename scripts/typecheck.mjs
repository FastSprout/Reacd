import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const compiler = fileURLToPath(
  new URL('../node_modules/typescript/bin/tsc', import.meta.url),
);
for (const project of ['tsconfig.build.json', '.', 'demo', 'docs/examples']) {
  execFileSync(process.execPath, [compiler, '-p', project], { stdio: 'inherit' });
}

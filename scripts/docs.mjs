import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const vite = fileURLToPath(
  new URL('../node_modules/vite/bin/vite.js', import.meta.url),
);
const artifacts = fileURLToPath(new URL('./docs-assets.ts', import.meta.url));
/** @param {string} file @param {string[]} args */
const execute = (file, args) => execFileSync(file, args, { stdio: 'inherit' });
execute(process.execPath, ['--import', 'tsx', artifacts, '--source']);
execute(process.execPath, [vite, 'build', '--config', 'vite.docs.config.ts']);
execute('.venv-docs/bin/python', ['-m', 'mkdocs', 'build', '--strict']);
execute(process.execPath, ['--import', 'tsx', artifacts]);

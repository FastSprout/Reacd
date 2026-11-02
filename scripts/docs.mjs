import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const vite = fileURLToPath(
  new URL('../node_modules/vite/bin/vite.js', import.meta.url),
);
const framework = fileURLToPath(new URL('./build.mjs', import.meta.url));
const site = fileURLToPath(new URL('./site-build.ts', import.meta.url));
/** @param {string} file @param {string[]} args */
const execute = (file, args) => execFileSync(file, args, { stdio: 'inherit' });
execute(process.execPath, [framework]);
execute(process.execPath, [vite, 'build', '--config', 'vite.site-build.config.ts']);
execute(process.execPath, ['--import', 'tsx', site]);

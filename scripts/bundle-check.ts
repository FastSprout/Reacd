import { globSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { inspectBundle } from '../tooling/build/bundle-report.js';

const root = new URL('../demo-dist/', import.meta.url);
const input: unknown = JSON.parse(
  readFileSync(new URL('.vite/manifest.json', root), 'utf8'),
);
const assets = new Map(
  globSync('**/*.js', { cwd: fileURLToPath(root) }).map((file) => [
    file,
    statSync(new URL(file, root)).size,
  ]),
);
console.log('Demo JavaScript bundle acceptance:', inspectBundle(input, assets));

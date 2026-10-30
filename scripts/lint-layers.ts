import { globSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { checkLayerGraph } from '../tooling/policy/layer-graph.js';
import { isProductionModule } from '../tooling/policy/layers.js';

const root = process.cwd();
const files = globSync(['src/**/*.{ts,tsx,mts,cts}'])
  .sort()
  .map((path) => resolve(root, path))
  .filter((path) => isProductionModule(path, root))
  .map((path) => ({ path, source: readFileSync(path, 'utf8') }));
if (files.length === 0) {
  throw new Error('No owned production modules found. Run from the repository root.');
}
for (const issue of checkLayerGraph(files, root)) {
  console.error(
    `${issue.file}:${issue.line}:${issue.column} ` + `[${issue.rule}] ${issue.message}`,
  );
  process.exitCode = 1;
}

import { readFileSync, writeFileSync } from 'node:fs';
import { createExample, scenarioSchema } from '../demo/example.js';

for (const scenario of scenarioSchema.options) {
  const path = new URL(`../examples/${scenario}.json`, import.meta.url);
  const output = `${JSON.stringify(createExample(scenario), null, 2)}\n`;
  if (process.argv.includes('--check')) {
    if (readFileSync(path, 'utf8') !== output) {
      throw new Error(`Stale example: ${scenario}. Run npm run examples.`);
    }
  } else {
    writeFileSync(path, output);
  }
}

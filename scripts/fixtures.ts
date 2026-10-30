import { readFileSync, writeFileSync } from 'node:fs';
import { createExample, scenarioSchema } from '../tooling/conformance/example.js';

for (const scenario of scenarioSchema.options) {
  const path = new URL(
    `../test-support/fixtures/generative/${scenario}.json`,
    import.meta.url,
  );
  const output = `${JSON.stringify(createExample(scenario), null, 2)}\n`;
  if (process.argv.includes('--check')) {
    if (readFileSync(path, 'utf8') !== output) {
      throw new Error(`Stale fixture: ${scenario}. Run npm run fixtures.`);
    }
  } else {
    writeFileSync(path, output);
  }
}

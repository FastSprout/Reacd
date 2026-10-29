import { readFileSync, writeFileSync } from 'node:fs';
import { z } from 'zod';
import { documentSchema, SCHEMA_ID } from '../src/contract.js';
import { generativeDocumentSchema } from '../src/schema/generative-v2/index.js';
import { GENERATIVE_POLICY } from '../src/core/state-policy.js';

const contracts = [
  { file: 'reacd.schema.json', id: SCHEMA_ID, schema: documentSchema },
  {
    file: 'generative.schema.json',
    id: GENERATIVE_POLICY.schemaId,
    schema: generativeDocumentSchema,
  },
];
for (const contract of contracts) {
  const schema = {
    ...z.toJSONSchema(contract.schema, { target: 'draft-2020-12' }),
    $id: contract.id,
  };
  const output = `${JSON.stringify(schema, null, 2)}\n`;
  const path = new URL(`../schema/${contract.file}`, import.meta.url);
  if (process.argv.includes('--check')) {
    if (readFileSync(path, 'utf8') !== output) {
      throw new Error(`${contract.file} is stale. Run npm run schema.`);
    }
  } else writeFileSync(path, output);
}

import { readFileSync } from 'node:fs';
import { parseDocumentJson } from '../src/contract.js';

const path = process.argv[2];
if (!path) throw new Error('Usage: npm run validate -- examples/standard.json');
const result = parseDocumentJson(readFileSync(path, 'utf8'));
if (result.success) {
  console.log('The reacd 0.1 document is structurally and semantically valid.');
} else {
  for (const issue of result.issues) console.error(`${issue.path}: ${issue.message}`);
  process.exitCode = 1;
}

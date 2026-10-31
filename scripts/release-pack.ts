import { fileURLToPath } from 'node:url';
import {
  packReleaseArchive,
  packShadcnArchive,
  packMuiArchive,
} from '../tooling/release/pack.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const archive = packReleaseArchive(root);
console.log(`Verified local release archive: ${archive}`);
const adapter = packShadcnArchive(root);
console.log(`Verified local shadcn archive: ${adapter}`);
const material = packMuiArchive(root);
console.log(`Verified local Material UI archive: ${material}`);

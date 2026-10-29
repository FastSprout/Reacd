import { fileURLToPath } from 'node:url';
import { packReleaseArchive } from '../tooling/release/pack.js';

const archive = packReleaseArchive(fileURLToPath(new URL('../', import.meta.url)));
console.log(`Verified local release archive: ${archive}`);

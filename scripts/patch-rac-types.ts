import { patchRacDeclarations } from '../tooling/dependencies/rac-types.js';

const changed = patchRacDeclarations(new URL('../', import.meta.url));
console.log(`Verified RAC declarations; corrected files: ${changed}.`);

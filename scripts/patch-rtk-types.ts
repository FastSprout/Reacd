import { patchRtkDeclarations } from '../tooling/dependencies/rtk-types.js';

const changed = patchRtkDeclarations(new URL('../', import.meta.url));
console.log(`Verified RTK declarations; corrected files: ${changed}.`);

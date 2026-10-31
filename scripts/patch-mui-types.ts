import { patchMuiDeclarations } from '../tooling/dependencies/mui-types.js';

const changed = patchMuiDeclarations(new URL('../', import.meta.url));
console.log(`Verified MUI declarations; corrected files: ${changed}.`);

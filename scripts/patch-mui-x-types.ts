import { patchMuiXDeclarations } from '../tooling/dependencies/mui-x-types.js';

const changed = patchMuiXDeclarations(new URL('../', import.meta.url));
console.log(`Verified MUI X declarations; corrected files: ${changed}.`);

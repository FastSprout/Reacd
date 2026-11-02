import { patchMuiChartsDeclarations } from
  '../tooling/dependencies/mui-charts-types.js';

const changed = patchMuiChartsDeclarations(new URL('../', import.meta.url));
console.log(`Verified MUI Charts declarations; corrected files: ${changed}.`);

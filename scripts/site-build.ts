import { buildSite } from '../tooling/site/build/site.js';
import { buildAppearance } from '../tooling/site/build/appearance.js';

await buildAppearance(process.cwd());
await buildSite(process.cwd());

import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { pageAnchorsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-anchors/page-anchors.schema.js';
import { MuiPageAnchors } from '../page-anchors/page-anchors.adapter.js';
import { pageLinksSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-links/page-links.schema.js';
import { MuiPageLinks } from '../page-links/page-links.adapter.js';
import { pageCTASchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-cta/page-cta.schema.js';
import { MuiPageCTA } from '../page-cta/page-cta.adapter.js';

export const pageNavigationEntries = {
  PageAnchors: renderEntry('PageAnchors', pageAnchorsSchema, MuiPageAnchors),
  PageLinks: renderEntry('PageLinks', pageLinksSchema, MuiPageLinks),
  PageCTA: renderEntry('PageCTA', pageCTASchema, MuiPageCTA),
};

import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { pageAnchorsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-anchors/page-anchors.schema.js';
import { ShadcnPageAnchors } from '../page-anchors/page-anchors.adapter.js';
import { pageLinksSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-links/page-links.schema.js';
import { ShadcnPageLinks } from '../page-links/page-links.adapter.js';
import { pageCTASchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-cta/page-cta.schema.js';
import { ShadcnPageCTA } from '../page-cta/page-cta.adapter.js';

export const pageNavigationEntries = {
  PageAnchors: renderEntry('PageAnchors', pageAnchorsSchema, ShadcnPageAnchors),
  PageLinks: renderEntry('PageLinks', pageLinksSchema, ShadcnPageLinks),
  PageCTA: renderEntry('PageCTA', pageCTASchema, ShadcnPageCTA),
};

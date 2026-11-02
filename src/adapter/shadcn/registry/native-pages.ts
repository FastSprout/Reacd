import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { pageAsideSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-aside/page-aside.schema.js';
import { ShadcnPageAside } from '../page-aside/page-aside.adapter.js';
import { pageBodySchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-body/page-body.schema.js';
import { ShadcnPageBody } from '../page-body/page-body.adapter.js';
import { pageColumnsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-columns/page-columns.schema.js';
import { ShadcnPageColumns } from '../page-columns/page-columns.adapter.js';
import { pageGridSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-grid/page-grid.schema.js';
import { ShadcnPageGrid } from '../page-grid/page-grid.adapter.js';
import { pageListSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-list/page-list.schema.js';
import { ShadcnPageList } from '../page-list/page-list.adapter.js';
import { pageLogosSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-logos/page-logos.schema.js';
import { ShadcnPageLogos } from '../page-logos/page-logos.adapter.js';
import { pageFeatureSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-feature/page-feature.schema.js';
import { ShadcnPageFeature } from '../page-feature/page-feature.adapter.js';
import { pageCardSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-card/page-card.schema.js';
import { ShadcnPageCard } from '../page-card/page-card.adapter.js';
import { pageCTASchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-cta/page-cta.schema.js';
import { ShadcnPageCTA } from '../page-cta/page-cta.adapter.js';

export const nativePagesEntries = {
  PageAside: renderEntry('PageAside', pageAsideSchema, ShadcnPageAside),
  PageBody: renderEntry('PageBody', pageBodySchema, ShadcnPageBody),
  PageColumns: renderEntry('PageColumns', pageColumnsSchema, ShadcnPageColumns),
  PageGrid: renderEntry('PageGrid', pageGridSchema, ShadcnPageGrid),
  PageList: renderEntry('PageList', pageListSchema, ShadcnPageList),
  PageLogos: renderEntry('PageLogos', pageLogosSchema, ShadcnPageLogos),
  PageFeature: renderEntry('PageFeature', pageFeatureSchema, ShadcnPageFeature),
  PageCard: renderEntry('PageCard', pageCardSchema, ShadcnPageCard),
  PageCTA: renderEntry('PageCTA', pageCTASchema, ShadcnPageCTA),
};

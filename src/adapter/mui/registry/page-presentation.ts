import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { pageHeaderSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-header/page-header.schema.js';
import { MuiPageHeader } from '../page-header/page-header.adapter.js';
import { pageFeatureSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-feature/page-feature.schema.js';
import { MuiPageFeature } from '../page-feature/page-feature.adapter.js';
import { pageCardSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-card/page-card.schema.js';
import { MuiPageCard } from '../page-card/page-card.adapter.js';
import { pageHeroSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-hero/page-hero.schema.js';
import { MuiPageHero } from '../page-hero/page-hero.adapter.js';
import { pageSectionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-section/page-section.schema.js';
import { MuiPageSection } from '../page-section/page-section.adapter.js';

export const pagePresentationEntries = {
  PageHeader: renderEntry('PageHeader', pageHeaderSchema, MuiPageHeader),
  PageFeature: renderEntry('PageFeature', pageFeatureSchema, MuiPageFeature),
  PageCard: renderEntry('PageCard', pageCardSchema, MuiPageCard),
  PageHero: renderEntry('PageHero', pageHeroSchema, MuiPageHero),
  PageSection: renderEntry('PageSection', pageSectionSchema, MuiPageSection),
};

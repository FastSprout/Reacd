import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { pageHeaderSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-header/page-header.schema.js';
import { ShadcnPageHeader } from '../page-header/page-header.adapter.js';
import { pageFeatureSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-feature/page-feature.schema.js';
import { ShadcnPageFeature } from '../page-feature/page-feature.adapter.js';
import { pageCardSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-card/page-card.schema.js';
import { ShadcnPageCard } from '../page-card/page-card.adapter.js';
import { pageHeroSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-hero/page-hero.schema.js';
import { ShadcnPageHero } from '../page-hero/page-hero.adapter.js';
import { pageSectionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-section/page-section.schema.js';
import { ShadcnPageSection } from '../page-section/page-section.adapter.js';

export const pagePresentationEntries = {
  PageHeader: renderEntry('PageHeader', pageHeaderSchema, ShadcnPageHeader),
  PageFeature: renderEntry('PageFeature', pageFeatureSchema, ShadcnPageFeature),
  PageCard: renderEntry('PageCard', pageCardSchema, ShadcnPageCard),
  PageHero: renderEntry('PageHero', pageHeroSchema, ShadcnPageHero),
  PageSection: renderEntry('PageSection', pageSectionSchema, ShadcnPageSection),
};

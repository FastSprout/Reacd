import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { mainSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/main/main.schema.js';
import { MuiMain } from '../main/main.adapter.js';
import { headerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/header/header.schema.js';
import { MuiHeader } from '../header/header.adapter.js';
import { footerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/footer/footer.schema.js';
import { MuiFooter } from '../footer/footer.adapter.js';
import { pageHeaderSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-header/page-header.schema.js';
import { MuiPageHeader } from '../page-header/page-header.adapter.js';
import { pageBodySchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-body/page-body.schema.js';
import { MuiPageBody } from '../page-body/page-body.adapter.js';
import { pageAsideSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-aside/page-aside.schema.js';
import { MuiPageAside } from '../page-aside/page-aside.adapter.js';
import { pageGridSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-grid/page-grid.schema.js';
import { MuiPageGrid } from '../page-grid/page-grid.adapter.js';
import { pageColumnsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-columns/page-columns.schema.js';
import { MuiPageColumns } from '../page-columns/page-columns.adapter.js';
import { pageHeroSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-hero/page-hero.schema.js';
import { MuiPageHero } from '../page-hero/page-hero.adapter.js';
import { pageSectionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-section/page-section.schema.js';
import { MuiPageSection } from '../page-section/page-section.adapter.js';
import { pageFeatureSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-feature/page-feature.schema.js';
import { MuiPageFeature } from '../page-feature/page-feature.adapter.js';
import { pageListSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-list/page-list.schema.js';
import { MuiPageList } from '../page-list/page-list.adapter.js';
import { pageLinksSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-links/page-links.schema.js';
import { MuiPageLinks } from '../page-links/page-links.adapter.js';
import { pageAnchorsSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-anchors/page-anchors.schema.js';
import { MuiPageAnchors } from '../page-anchors/page-anchors.adapter.js';

import { pageCardSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-card/page-card.schema.js';
import { MuiPageCard } from '../page-card/page-card.adapter.js';
import { pageCTASchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-cta/page-cta.schema.js';
import { MuiPageCTA } from '../page-cta/page-cta.adapter.js';
import { pageLogosSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-logos/page-logos.schema.js';
import { MuiPageLogos } from '../page-logos/page-logos.adapter.js';

export const nativeStructureEntries = {
  Main: renderEntry('Main', mainSchema, MuiMain),
  Header: renderEntry('Header', headerSchema, MuiHeader),
  Footer: renderEntry('Footer', footerSchema, MuiFooter),
  PageHeader: renderEntry('PageHeader', pageHeaderSchema, MuiPageHeader),
  PageBody: renderEntry('PageBody', pageBodySchema, MuiPageBody),
  PageAside: renderEntry('PageAside', pageAsideSchema, MuiPageAside),
  PageGrid: renderEntry('PageGrid', pageGridSchema, MuiPageGrid),
  PageColumns: renderEntry('PageColumns', pageColumnsSchema, MuiPageColumns),
  PageHero: renderEntry('PageHero', pageHeroSchema, MuiPageHero),
  PageSection: renderEntry('PageSection', pageSectionSchema, MuiPageSection),
  PageFeature: renderEntry('PageFeature', pageFeatureSchema, MuiPageFeature),
  PageList: renderEntry('PageList', pageListSchema, MuiPageList),
  PageLinks: renderEntry('PageLinks', pageLinksSchema, MuiPageLinks),
  PageAnchors: renderEntry('PageAnchors', pageAnchorsSchema, MuiPageAnchors),
  PageCard: renderEntry('PageCard', pageCardSchema, MuiPageCard),
  PageCTA: renderEntry('PageCTA', pageCTASchema, MuiPageCTA),
  PageLogos: renderEntry('PageLogos', pageLogosSchema, MuiPageLogos),
};

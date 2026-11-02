import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { headerSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/header/header.schema.js';
import { pageHeroSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-hero/page-hero.schema.js';
import { contentNavigationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-navigation/index.js';
import { contentTocSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-toc/index.js';
import { navigationMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/navigation-menu/navigation-menu.schema.js';
import { scrollAreaSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/scroll-area/scroll-area.schema.js';
import { ShadcnHeader } from '../header/header.adapter.js';
import { ShadcnPageHero } from '../page-hero/page-hero.adapter.js';
import { ShadcnContentNavigation } from
  '../content-navigation/content-navigation.adapter.js';
import { ShadcnContentToc } from '../content-toc/content-toc.adapter.js';
import { ShadcnNavigationMenu } from '../navigation-menu/navigation-menu.adapter.js';
import { ShadcnScrollArea } from '../scroll-area/scroll-area.adapter.js';

import { pageSectionSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/page-section/page-section.schema.js';
import { ShadcnPageSection } from '../page-section/page-section.adapter.js';

export const nativeDocumentationEntries = {
  Header: renderEntry('Header', headerSchema, ShadcnHeader),
  PageSection: renderEntry('PageSection', pageSectionSchema, ShadcnPageSection),
  PageHero: renderEntry('PageHero', pageHeroSchema, ShadcnPageHero),
  ContentNavigation: renderEntry(
    'ContentNavigation',
    contentNavigationSchema,
    ShadcnContentNavigation,
  ),
  ContentToc: renderEntry('ContentToc', contentTocSchema, ShadcnContentToc),
  NavigationMenu: renderEntry(
    'NavigationMenu',
    navigationMenuSchema,
    ShadcnNavigationMenu,
  ),
  ScrollArea: renderEntry('ScrollArea', scrollAreaSchema, ShadcnScrollArea),
};

import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { contentNavigationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-navigation/index.js';
import { contentTocSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-toc/index.js';
import { ShadcnContentNavigation } from
  '../content-navigation/content-navigation.adapter.js';
import { ShadcnContentToc } from '../content-toc/content-toc.adapter.js';

export const contentOutlineEntries = {
  ContentNavigation: renderEntry(
    'ContentNavigation',
    contentNavigationSchema,
    ShadcnContentNavigation,
  ),
  ContentToc: renderEntry('ContentToc', contentTocSchema, ShadcnContentToc),
};

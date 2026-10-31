import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { contentNavigationSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-navigation/index.js';
import { contentTocSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-toc/index.js';
import { MuiContentNavigation } from
  '../content-navigation/content-navigation.adapter.js';
import { MuiContentToc } from '../content-toc/content-toc.adapter.js';

export const contentOutlineEntries = {
  ContentNavigation: renderEntry(
    'ContentNavigation',
    contentNavigationSchema,
    MuiContentNavigation,
  ),
  ContentToc: renderEntry('ContentToc', contentTocSchema, MuiContentToc),
};

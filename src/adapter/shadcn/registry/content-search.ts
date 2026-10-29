import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { contentSearchSchema } from '../../../schema/content-search/index.js';
import {
  contentSearchButtonSchema,
} from '../../../schema/content-search-button/index.js';
import { ShadcnContentSearch } from '../content-search/content-search.adapter.js';
import {
  ShadcnContentSearchButton,
} from '../content-search-button/content-search-button.adapter.js';

export const contentSearchEntries = {
  ContentSearch: renderEntry('ContentSearch', contentSearchSchema, ShadcnContentSearch),
  ContentSearchButton: renderEntry(
    'ContentSearchButton',
    contentSearchButtonSchema,
    ShadcnContentSearchButton,
  ),
};

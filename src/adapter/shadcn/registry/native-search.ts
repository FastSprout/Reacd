import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { commandPaletteSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/command-palette/command-palette.schema.js';
import { contentSearchSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-search/index.js';
import { ShadcnCommandPalette } from '../command-palette/command-palette.adapter.js';
import { ShadcnContentSearch } from '../content-search/content-search.adapter.js';
import { contentSearchButtonSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/content-search-button/index.js';
import { ShadcnContentSearchButton } from
  '../content-search-button/content-search-button.adapter.js';

export const nativeSearchEntries = {
  CommandPalette: renderEntry(
    'CommandPalette',
    commandPaletteSchema,
    ShadcnCommandPalette,
  ),
  ContentSearch: renderEntry('ContentSearch', contentSearchSchema, ShadcnContentSearch),
  ContentSearchButton: renderEntry(
    'ContentSearchButton',
    contentSearchButtonSchema,
    ShadcnContentSearchButton,
  ),
};

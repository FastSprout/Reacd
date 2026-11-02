import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { localeSelectSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/locale-select/locale-select.schema.js';
import { MuiLocaleSelect } from '../locale-select/locale-select.adapter.js';

export const nativeLocaleEntries = {
  LocaleSelect: renderEntry('LocaleSelect', localeSelectSchema, MuiLocaleSelect),
};

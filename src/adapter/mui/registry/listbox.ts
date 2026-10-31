import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { listboxSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/listbox/listbox.schema.js';
import { MuiListbox } from '../listbox/listbox.adapter.js';

export const listboxEntries = {
  Listbox: renderEntry('Listbox', listboxSchema, MuiListbox),
};

import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { listboxSchema } from '../../../schema/listbox/listbox.schema.js';
import { ShadcnListbox } from '../listbox/listbox.adapter.js';

export const listboxEntries = {
  Listbox: renderEntry('Listbox', listboxSchema, ShadcnListbox),
};

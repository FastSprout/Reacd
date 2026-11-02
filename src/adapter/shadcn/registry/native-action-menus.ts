import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { dropdownMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/dropdown-menu/dropdown-menu.schema.js';
import { ShadcnDropdownMenu } from '../dropdown-menu/dropdown-menu.adapter.js';

export const nativeActionMenuEntries = {
  DropdownMenu: renderEntry('DropdownMenu', dropdownMenuSchema, ShadcnDropdownMenu),
};

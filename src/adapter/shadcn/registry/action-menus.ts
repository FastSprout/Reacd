import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import {
  dropdownMenuSchema,
} from '../../../schema/dropdown-menu/dropdown-menu.schema.js';
import { contextMenuSchema } from '../../../schema/context-menu/context-menu.schema.js';
import { ShadcnDropdownMenu } from '../dropdown-menu/dropdown-menu.adapter.js';
import { ShadcnContextMenu } from '../context-menu/context-menu.adapter.js';
export const actionMenuEntries = {
  DropdownMenu: renderEntry('DropdownMenu', dropdownMenuSchema, ShadcnDropdownMenu),
  ContextMenu: renderEntry('ContextMenu', contextMenuSchema, ShadcnContextMenu),
};

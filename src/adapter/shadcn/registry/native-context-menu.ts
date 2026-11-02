import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { contextMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/context-menu/context-menu.schema.js';
import { ShadcnContextMenu } from '../context-menu/context-menu.adapter.js';

export const nativeContextMenuEntries = {
  ContextMenu: renderEntry('ContextMenu', contextMenuSchema, ShadcnContextMenu),
};

import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { selectMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/select-menu/index.js';
import { ShadcnSelectMenu } from '../select-menu/select-menu.adapter.js';

export const nativeSelectionEntries = {
  SelectMenu: renderEntry('SelectMenu', selectMenuSchema, ShadcnSelectMenu),
};

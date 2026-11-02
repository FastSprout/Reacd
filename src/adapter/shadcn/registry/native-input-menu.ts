import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { inputMenuSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/input-menu/index.js';
import { ShadcnInputMenu } from '../input-menu/input-menu.adapter.js';

export const nativeInputMenuEntries = {
  InputMenu: renderEntry('InputMenu', inputMenuSchema, ShadcnInputMenu),
};

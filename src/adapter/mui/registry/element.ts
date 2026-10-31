import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { iconSchema } from '@fastsprout/reacd/adapter-runtime/schema/icon/index.js';
import { MuiIcon } from '../icon/icon.adapter.js';
export const elementEntries = { Icon: renderEntry('Icon', iconSchema, MuiIcon) };

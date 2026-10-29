import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { iconSchema } from '../../../schema/icon/index.js';
import { ShadcnIcon } from '../icon/icon.adapter.js';
export const elementEntries = { Icon: renderEntry('Icon', iconSchema, ShadcnIcon) };

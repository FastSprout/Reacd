import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { proseSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/prose/prose.schema.js';
import { ShadcnProse } from '../prose/prose.adapter.js';

export const nativeProseEntries = {
  Prose: renderEntry('Prose', proseSchema, ShadcnProse),
};

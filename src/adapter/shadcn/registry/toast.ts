import { renderEntry } from
  '@fastsprout/reacd/adapter-runtime/renderer/contracts/render-entry.js';
import { toastSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/toast/toast.schema.js';
import { ShadcnToast } from '../toast/toast.adapter.js';
export const toastEntries = { Toast: renderEntry('Toast', toastSchema, ShadcnToast) };

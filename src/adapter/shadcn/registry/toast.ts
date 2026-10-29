import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { toastSchema } from '../../../schema/toast/toast.schema.js';
import { ShadcnToast } from '../toast/toast.adapter.js';
export const toastEntries = { Toast: renderEntry('Toast', toastSchema, ShadcnToast) };

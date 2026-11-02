import { TOAST_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';

export function reserveAdmission(ids: readonly string[], id: string) {
  return ids.includes(id) || ids.length >= TOAST_POLICY.maximumQueued
    ? ids : [...ids, id];
}

export function releaseAdmission(ids: readonly string[], id: string) {
  return ids.includes(id) ? ids.filter(current => current !== id) : ids;
}

export function toastAdmission(ids: readonly string[], id: string) {
  const position = ids.indexOf(id);
  if (position < 0) {
    return ids.length >= TOAST_POLICY.maximumQueued ? 'full' : 'waiting';
  }
  return position < TOAST_POLICY.maximumVisible ? 'visible' : 'queued';
}

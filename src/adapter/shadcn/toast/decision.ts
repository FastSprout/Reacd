import { toastDecision } from
  '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';

export type ToastFeedback = 'rejected' | 'invalid' | 'actionError';

export function toastFeedback(callback: () => unknown): ToastFeedback | null {
  try {
    const value: unknown = callback();
    const decision = toastDecision(value);
    if (decision === 'accept') return null;
    if (decision === 'veto') return 'rejected';
    void Promise.resolve(value).catch(() => undefined);
    return 'invalid';
  } catch {
    return 'actionError';
  }
}

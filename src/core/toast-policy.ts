export const TOAST_DURATION_NAMES = ['normal', 'long', 'persistent'] as const;
export const TOAST_DURATIONS = {
  normal: 5_000,
  long: 10_000,
  persistent: 0,
} as const;
export const TOAST_INTENTS = ['neutral', 'success', 'danger'] as const;
export const TOAST_PRIORITIES = ['normal', 'urgent'] as const;
export const TOAST_POLICY = {
  maximumVisible: 3,
  maximumQueued: 32,
  widthRem: 28,
  gripWidthRem: 3,
  gripBlockPx: 4,
  maximumBlockViewportPercent: 60,
  layer: 120,
} as const;
export const TOAST_DEFAULTS = {
  intent: 'neutral',
  priority: 'normal',
  duration: 'normal',
  actionDuration: 'persistent',
  closeLabel: 'Dismiss notification',
  closeOnAction: true,
  rejected: 'The notification change was rejected.',
  invalid: 'Notification callbacks must return a boolean or no value.',
  actionError: 'The notification action failed.',
  limit: 'The notification queue is full.',
} as const;
export function toastTimeout(
  duration: keyof typeof TOAST_DURATIONS | undefined,
  actionable: boolean,
): number {
  const selected =
    duration ?? (actionable ? TOAST_DEFAULTS.actionDuration : TOAST_DEFAULTS.duration);
  return TOAST_DURATIONS[selected];
}

export function toastDecision(value: unknown): 'accept' | 'veto' | 'invalid' {
  if (value === false) return 'veto';
  return value === undefined || value === true ? 'accept' : 'invalid';
}

import { expect, it } from 'vitest';
import { alertSchema } from './alert.schema.js';

const base = {
  title: 'Action required',
  message: 'Check the form.',
  intent: 'warning',
};
const action = { id: 'review', label: 'Review', onPress: () => undefined };
it('accepts static, readonly, dismissible and action alerts', () => {
  for (const change of [
    {},
    { open: false },
    { open: true },
    { open: true, onOpenChange: () => undefined },
    { open: true, onOpenChange: () => undefined, closeLabel: 'Dismiss warning' },
    { actions: [action], icon: 'warning' },
  ])
    expect(alertSchema.safeParse({ ...base, ...change }).success).toBe(true);
});
it('rejects uncontrolled dismissal, duplicate actions and presentation escapes', () => {
  for (const change of [
    { onOpenChange: () => undefined },
    { closeLabel: 'Dismiss' },
    { actions: [action, action] },
    { actions: [{ id: 'review', label: 'Review' }] },
    {
      actions: Array.from({ length: 5 }, (_, index) => ({
        ...action,
        id: `a${index}`,
      })),
    },
    { icon: 'raw' },
    { style: {} },
    { className: 'alert' },
  ])
    expect(alertSchema.safeParse({ ...base, ...change }).success).toBe(false);
});

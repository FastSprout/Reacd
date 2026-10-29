import { expect, it, vi } from 'vitest';
import { toastSchema } from './toast.schema.js';
const base = { title: 'Saved', open: false, onOpenChange: vi.fn() };
it('validates closed notification declarations', () => {
  expect(
    toastSchema.safeParse({
      ...base,
      description: 'Ready',
      intent: 'success',
      priority: 'urgent',
      duration: 'long',
      action: { label: 'Undo', onPress: vi.fn() },
    }).success,
  ).toBe(true);
  for (const properties of [
    { style: {} },
    { className: 'custom' },
    { onClick: vi.fn() },
    { duration: 1 },
    { duration: 'forever' },
    { onOpenChange: false },
    { action: { label: 'Undo', onPress: 'run' } },
    { title: '' },
  ])
    expect(toastSchema.safeParse({ ...base, ...properties }).success).toBe(false);
});

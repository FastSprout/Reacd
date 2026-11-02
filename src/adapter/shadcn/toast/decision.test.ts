import { expect, it, vi } from 'vitest';
import { toastFeedback } from './decision.js';

it('validates decisions and consumes invalid asynchronous results', async () => {
  expect(toastFeedback(() => undefined)).toBeNull();
  expect(toastFeedback(() => true)).toBeNull();
  expect(toastFeedback(() => false)).toBe('rejected');
  expect(toastFeedback(() => 'invalid')).toBe('invalid');
  expect(toastFeedback(() => { throw new Error('Unavailable'); }))
    .toBe('actionError');
  const rejected = Promise.reject(new Error('Invalid async callback'));
  expect(toastFeedback(() => rejected)).toBe('invalid');
  await rejected.catch(vi.fn());
});

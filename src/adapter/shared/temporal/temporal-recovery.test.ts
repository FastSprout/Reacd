import { expect, it } from 'vitest';
import { temporalRecovery } from './temporal-recovery.js';

it('compares canonical endpoint values and limits rather than object identity', () => {
  const first = temporalRecovery({ start: null, end: '2024-01-05' }, {});
  const reordered = temporalRecovery({ end: '2024-01-05', start: null }, {});
  expect(first.key).toBe(reordered.key);
  expect(temporalRecovery(null, {}).key).not.toBe(first.key);
  expect(temporalRecovery('2024-01-01', {}).key).not.toBe(first.key);
  expect(temporalRecovery(first.value, { min: '2024-01-01' }).key).not.toBe(first.key);
  expect(first.value).toEqual({ start: null, end: '2024-01-05' });
});

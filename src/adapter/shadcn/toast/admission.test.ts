import { expect, it } from 'vitest';
import { TOAST_POLICY } from '../../../core/toast-policy.js';
import { releaseAdmission, reserveAdmission, toastAdmission } from './admission.js';

it('selects bounded FIFO declarations without evicting earlier visible IDs', () => {
  const empty: readonly string[] = [];
  expect(toastAdmission(empty, 'first')).toBe('waiting');
  let ids = empty;
  for (let index = 0; index < TOAST_POLICY.maximumQueued; index++) {
    ids = reserveAdmission(ids, `notice-${index}`);
  }
  expect(reserveAdmission(ids, 'notice-0')).toBe(ids);
  expect(reserveAdmission(ids, 'excess')).toBe(ids);
  expect(toastAdmission(ids, 'excess')).toBe('full');
  expect(toastAdmission(ids, 'notice-0')).toBe('visible');
  expect(toastAdmission(ids, 'notice-3')).toBe('queued');
  expect(releaseAdmission(ids, 'missing')).toBe(ids);
  ids = releaseAdmission(ids, 'notice-0');
  expect(toastAdmission(ids, 'notice-3')).toBe('visible');
  expect(reserveAdmission(ids, 'excess')).toContain('excess');
});

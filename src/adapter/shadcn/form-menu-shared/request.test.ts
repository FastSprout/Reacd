import { expect, it } from 'vitest';
import { requestFormMenuChange } from './request.js';
import { FORM_MENU_DEFAULTS } from '../../../core/form-menu-policy.js';

it('distinguishes logical acceptance/veto from invalid asynchronous returns', () => {
  expect(requestFormMenuChange(() => undefined)).toEqual({ accepted: true });
  expect(requestFormMenuChange(() => true)).toEqual({ accepted: true });
  expect(requestFormMenuChange(() => false)).toEqual({ accepted: false });
  for (const value of [null, 'yes', 1, Promise.resolve(true)]) {
    expect(requestFormMenuChange(() => value)).toEqual({
      accepted: false,
      error: FORM_MENU_DEFAULTS.callbackError,
    });
  }
  expect(
    requestFormMenuChange(() => {
      throw new Error('Host failure');
    }),
  ).toEqual({ accepted: false, error: FORM_MENU_DEFAULTS.callbackFailure });
});

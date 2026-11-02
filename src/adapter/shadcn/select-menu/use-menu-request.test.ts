import { act, renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import { menuTextChangeSchema } from '../../../schema/form-menu-shared/menu.schema.js';
import { FORM_MENU_DEFAULTS } from '../../../core/form-menu-policy.js';
import { useMenuRequest } from './use-menu-request.js';

it('validates callbacks and isolates throws and async rejections', async () => {
  const { result } = renderHook(useMenuRequest);
  for (const callback of [undefined, () => undefined, () => true]) {
    act(() => expect(result.current.request(callback, 'a')).toBe(true));
  }
  act(() => expect(result.current.request(() => false, 'a')).toBe(false));
  for (const callback of [() => 'wrong', () => Promise.reject(new Error('Rejected'))]) {
    act(() =>
      expect(result.current.request(menuTextChangeSchema.parse(callback), 'a')).toBe(
        false,
      ),
    );
    expect(result.current.error).toBe(FORM_MENU_DEFAULTS.callbackError);
  }
  act(() =>
    expect(
      result.current.request(() => {
        throw new Error('Failed');
      }, 'a'),
    ).toBe(false),
  );
  expect(result.current.error).toBe(FORM_MENU_DEFAULTS.callbackFailure);
  await act(async () => {
    await Promise.resolve();
  });
});

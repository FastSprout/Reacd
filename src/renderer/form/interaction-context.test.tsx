import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { expect, it } from 'vitest';
import { PortalActiveContext } from '../theme/portal-context.js';
import { FormPendingContext, useInteractionState } from './interaction-context.js';

it('defaults to active nonpending interaction', () => {
  expect(renderHook(useInteractionState).result.current).toEqual({
    active: true, pending: false, interactive: true,
  });
});

it.each([
  { active: true, pending: true },
  { active: false, pending: false },
  { active: false, pending: true },
])('retains independent activity and pending reasons: %j', (state) => {
  const result = renderHook(useInteractionState, {
    wrapper: ({ children }: { children: ReactNode }) =>
      <PortalActiveContext value={state.active}>
        <FormPendingContext value={state.pending}>{children}</FormPendingContext>
      </PortalActiveContext>,
  });
  expect(result.result.current).toEqual({ ...state, interactive: false });
});

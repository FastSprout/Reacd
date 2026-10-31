import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import type { ReactNode } from 'react';
import { Provider } from 'jotai';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { createReacdStore } from '../store.js';
import { colorModeAtom } from './color-mode.atom.js';
import { ReacdProvider } from '../provider/provider.js';
import { useColorMode } from './use-color-mode.js';

function Scope({ children }: { children: ReactNode }) {
  return <ReacdProvider adapter={shadcnAdapter}>{children}</ReacdProvider>;
}

it('keeps preferences isolated and resolves explicit system snapshots', () => {
  const first = renderHook(({ system }) => useColorMode(system), {
    initialProps: { system: 'light' as const },
    wrapper: Scope,
  });
  const second = renderHook(() => useColorMode('dark'), { wrapper: Scope });
  expect(first.result.current.value).toBe('system');
  expect(first.result.current.resolvedMode).toBe('light');
  expect(second.result.current.resolvedMode).toBe('dark');
  act(() => first.result.current.setValue('dark'));
  expect(first.result.current.value).toBe('dark');
  expect(first.result.current.resolvedMode).toBe('dark');
  expect(second.result.current.value).toBe('system');
  act(() => first.result.current.setValue('light'));
  expect(first.result.current.resolvedMode).toBe('light');
  act(() => first.result.current.setValue('system'));
  expect(first.result.current.resolvedMode).toBe('light');
});

it('requires an explicit application scope', () => {
  expect(() => renderHook(() => useColorMode('light'))).toThrow(
    FRAMEWORK_ERRORS.missingProvider,
  );
});

it('keeps a nested foreign Jotai provider outside application preference state', () => {
  const application = createReacdStore();
  const foreign = createReacdStore();
  const hook = renderHook(() => useColorMode('light'), {
    wrapper: ({ children }) => (
      <ReacdProvider adapter={shadcnAdapter} store={application}>
        <Provider store={foreign}>{children}</Provider>
      </ReacdProvider>
    ),
  });
  act(() => hook.result.current.setValue('dark'));
  expect(application.get(colorModeAtom)).toBe('dark');
  expect(foreign.get(colorModeAtom)).toBe('system');
});

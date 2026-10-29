import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import type { Result } from '../../core/result.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { useBoundValue } from './use-bound-value.js';

function value<T>(result: Result<T>): T {
  if (!result.success) throw new Error(JSON.stringify(result.issues));
  return result.data;
}

const WRITE = { kinds: ['text'], mode: 'readWrite' } as const;
const READ = { kinds: ['text'], mode: 'read' } as const;
const NUMBER = { kinds: ['number'], mode: 'readWrite' } as const;
const WRITE_REF = { state: 'name', mode: 'readWrite' } as const;
const READ_REF = { state: 'name', mode: 'read' } as const;
const NUMBER_REF = { state: 'amount', mode: 'readWrite' } as const;
const TEXT_SCHEMA = z.string();
const NUMBER_SCHEMA = z.number().min(0).max(10);

describe('reactive bound values', () => {
  it('validates writes and updates the current value reactively', () => {
    const registry = value(
      createStateRegistry([
        { key: 'name', kind: 'text', initial: 'Initial', access: 'readWrite' },
      ]),
    );
    const hook = renderHook(() =>
      useBoundValue(registry, WRITE_REF, WRITE, TEXT_SCHEMA),
    );
    expect(value(hook.result.current).value).toBe('Initial');
    act(() => {
      value(value(hook.result.current).write('Edited'));
    });
    expect(value(hook.result.current).value).toBe('Edited');
  });

  it('prevents writes through a display binding', () => {
    const registry = value(
      createStateRegistry([
        { key: 'name', kind: 'text', initial: 'Initial', access: 'readWrite' },
      ]),
    );
    const hook = renderHook(() => useBoundValue(registry, READ_REF, READ, TEXT_SCHEMA));
    expect(value(hook.result.current).write('Forbidden').success).toBe(false);
    expect(value(registry.read('name')).value).toBe('Initial');
  });

  it('fails closed for missing keys and incompatible property values', () => {
    const registry = value(
      createStateRegistry([
        { key: 'amount', kind: 'number', initial: 20, access: 'readWrite' },
      ]),
    );
    const missing = renderHook(() =>
      useBoundValue(registry, READ_REF, READ, TEXT_SCHEMA),
    );
    expect(missing.result.current.success).toBe(false);
    const incompatible = renderHook(() =>
      useBoundValue(registry, NUMBER_REF, NUMBER, NUMBER_SCHEMA),
    );
    expect(incompatible.result.current.success).toBe(false);
  });

  it('rejects changes outside the bound property range without mutating state', () => {
    const registry = value(
      createStateRegistry([
        { key: 'amount', kind: 'number', initial: 5, access: 'readWrite' },
      ]),
    );
    const hook = renderHook(() =>
      useBoundValue(registry, NUMBER_REF, NUMBER, NUMBER_SCHEMA),
    );
    expect(value(hook.result.current).write(20).success).toBe(false);
    expect(value(registry.read('amount')).value).toBe(5);
    expect(registry.update('amount', 20).success).toBe(false);
    hook.unmount();
    expect(registry.update('amount', 20).success).toBe(true);
  });

  it('handles a subscription-time conflict and a rejected constraint reader', () => {
    const registry = value(
      createStateRegistry([
        { key: 'amount', kind: 'number', initial: 5, access: 'readWrite' },
      ]),
    );
    const concurrent = {
      ...registry,
      constrain: (...args: Parameters<typeof registry.constrain>) => {
        const [, validate] = args;
        expect(
          validate(() => ({
            success: false,
            issues: [{ path: 'amount', message: 'Unavailable snapshot.' }],
          })).success,
        ).toBe(false);
        value(registry.update('amount', 20));
        return registry.constrain(...args);
      },
    };
    const hook = renderHook(() =>
      useBoundValue(concurrent, NUMBER_REF, NUMBER, NUMBER_SCHEMA),
    );
    expect(hook.result.current.success).toBe(false);
  });
});

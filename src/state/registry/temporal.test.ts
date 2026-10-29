import { expect, it, vi } from 'vitest';
import type { Result } from '../../core/result.js';
import { createStateRegistry } from './state-registry.js';
import { boundedDateValueSchema } from '../../schema/date-time/index.js';

function value<T>(result: Result<T>): T {
  if (!result.success) throw new Error(JSON.stringify(result.issues));
  return result.data;
}

const samples = [
  { kind: 'date', initial: null, accepted: '2024-02-29', invalid: '2023-02-29' },
  { kind: 'time', initial: null, accepted: '23:59:59', invalid: '24:00:00' },
  {
    kind: 'dateRange',
    initial: { start: null, end: null },
    accepted: { start: null, end: '2024-02-29' },
    invalid: { start: '2024-03-01', end: '2024-02-29' },
  },
  {
    kind: 'timeRange',
    initial: { start: null, end: null },
    accepted: { start: '01:02:03', end: '02:03:04' },
    invalid: { start: '23:59:59', end: '00:00:00' },
  },
] as const;

it.each(samples)('validates $kind writes, permissions and isolated stores', (item) => {
  const definitions = [
    { key: 'value', kind: item.kind, initial: item.initial, access: 'readWrite' },
  ];
  const first = value(createStateRegistry(definitions));
  const second = value(createStateRegistry(definitions));
  const notify = vi.fn();
  const unsubscribe = value(first.subscribe('value', notify));
  expect(first.update('value', item.invalid).success).toBe(false);
  expect(notify).not.toHaveBeenCalled();
  value(first.update('value', item.accepted));
  expect(notify).toHaveBeenCalledOnce();
  expect(value(first.read('value')).value).toEqual(item.accepted);
  expect(value(second.read('value')).value).toEqual(item.initial);
  const binding = value(
    first.bind({ state: 'value', mode: 'read' }, { kinds: [item.kind], mode: 'read' }),
  );
  expect('write' in binding).toBe(false);
  value(first.reset());
  expect(value(first.read('value')).value).toEqual(item.initial);
  unsubscribe();
  expect(
    createStateRegistry([{ ...definitions[0], initial: item.invalid }]).success,
  ).toBe(false);
});

it('intersects calendar bounds for host and transactional updates', () => {
  const registry = value(
    createStateRegistry([
      { key: 'day', kind: 'date', initial: null, access: 'readWrite' },
    ]),
  );
  const domain = boundedDateValueSchema({ min: '2024-01-01', max: '2024-12-31' });
  const remove = value(
    registry.constrain(['day'], (read) => {
      const parsed = domain.safeParse(value(read('day')).value);
      return parsed.success
        ? { success: true, data: undefined }
        : { success: false, issues: [{ path: 'day', message: 'Outside limits.' }] };
    }),
  );
  expect(registry.update('day', '2025-01-01').success).toBe(false);
  expect(registry.transaction([{ key: 'day', value: '2025-01-01' }]).success).toBe(
    false,
  );
  value(registry.update('day', '2024-02-29'));
  value(registry.update('day', null));
  remove();
  value(registry.update('day', '2025-01-01'));
});

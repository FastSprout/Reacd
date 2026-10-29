import { expect, it, vi } from 'vitest';
import { boundedEditor } from './editor-budget.js';
import { EDITOR_POLICY } from './editor-policy.js';

it('rejects spoofed array lengths before traversing untrusted entries', () => {
  for (const length of ['invalid', 0.5, -1]) {
    const array = new Proxy([], {
      getOwnPropertyDescriptor(target, key) {
        return key === 'length' ? {
          value: length, writable: true, configurable: false, enumerable: false,
        } : Object.getOwnPropertyDescriptor(target, key);
      },
    });
    expect(boundedEditor(array)).toBe(false);
  }
});

it('accepts bounded JSON and rejects non-JSON records and primitives', () => {
  expect(boundedEditor({ version: 1, nested: [null, true, false, 1, 'text'] })).toBe(
    true,
  );
  expect(boundedEditor(Object.create(null))).toBe(true);
  for (const value of [
    undefined,
    NaN,
    Infinity,
    1n,
    Symbol('x'),
    () => null,
    new Date(),
    new Map(),
    new Set(),
  ])
    expect(boundedEditor(value)).toBe(false);
});

it('ignores polluted inherited keys and rejects array property escape hatches', () => {
  Object.defineProperty(Object.prototype, 'editorPollutionFixture', {
    value: () => null,
    enumerable: true,
    configurable: true,
    writable: true,
  });
  try {
    expect(boundedEditor({ type: 'unknown', text: 'Safe own data' })).toBe(true);
    expect(boundedEditor([null])).toBe(true);
  } finally {
    Reflect.deleteProperty(Object.prototype, 'editorPollutionFixture');
  }
  const extra: unknown[] = [];
  Object.defineProperty(extra, 'html', { value: '<div>', enumerable: true });
  expect(boundedEditor(extra)).toBe(false);
  const numeric: unknown[] = [];
  Object.defineProperty(numeric, '4294967295', { value: null, enumerable: true });
  expect(boundedEditor(numeric)).toBe(false);
  const foreign: unknown[] = [];
  Object.setPrototypeOf(foreign, null);
  expect(boundedEditor(foreign)).toBe(false);
});

it('rejects aliases, cycles, sparse arrays and accessors safely', () => {
  const shared = { text: 'shared' };
  expect(boundedEditor([shared, shared])).toBe(false);
  const cycle: unknown[] = [];
  cycle.push(cycle);
  expect(boundedEditor(cycle)).toBe(false);
  expect(boundedEditor(new Array(2))).toBe(false);
  const getter = vi.fn(() => 'unsafe');
  const record = {};
  Object.defineProperty(record, 'content', { get: getter, enumerable: true });
  expect(boundedEditor(record)).toBe(false);
  const array: unknown[] = [];
  Object.defineProperty(array, '0', { get: getter, enumerable: true });
  expect(boundedEditor(array)).toBe(false);
  expect(getter).not.toHaveBeenCalled();
  const hostile = new Proxy(
    {},
    {
      getPrototypeOf() {
        throw new Error('Hostile');
      },
    },
  );
  expect(boundedEditor(hostile)).toBe(false);
});

it('bounds pending work, depth, text and structural blocks before conversion', () => {
  const getter = vi.fn(() => null);
  const tooWide = new Array(EDITOR_POLICY.maxValues + 1);
  Object.defineProperty(tooWide, '0', { get: getter, enumerable: true });
  expect(boundedEditor(tooWide)).toBe(false);
  expect(getter).not.toHaveBeenCalled();
  let deep: unknown = null;
  for (let depth = 0; depth <= EDITOR_POLICY.maxDepth; depth += 1) deep = [deep];
  expect(boundedEditor(deep)).toBe(false);
  expect(boundedEditor('x'.repeat(EDITOR_POLICY.maxCharacters))).toBe(true);
  expect(boundedEditor('x'.repeat(EDITOR_POLICY.maxCharacters + 1))).toBe(false);
  const property = 'x'.repeat(EDITOR_POLICY.maxCharacters + 1);
  expect(boundedEditor({ [property]: null })).toBe(false);
  expect(
    boundedEditor(
      Array.from({ length: EDITOR_POLICY.maxBlocks }, () => ({ type: 'paragraph' })),
    ),
  ).toBe(true);
  expect(
    boundedEditor(
      Array.from({ length: EDITOR_POLICY.maxBlocks + 1 }, () => ({
        type: 'paragraph',
      })),
    ),
  ).toBe(false);
  expect(
    boundedEditor(
      Object.fromEntries(
        Array.from({ length: EDITOR_POLICY.maxValues }, (_, index) => [
          `key${index}`,
          null,
        ]),
      ),
    ),
  ).toBe(false);
});

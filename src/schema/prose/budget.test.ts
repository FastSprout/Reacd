import { expect, it, vi } from 'vitest';
import { PROSE_POLICY } from '../../core/prose-policy.js';
import { boundedProse } from './budget.js';
import { proseDocumentSchema } from './prose.schema.js';

it('bounds recursion before lazy schemas encounter cycles or extreme depth', () => {
  const cycle: { children: unknown[] } = { children: [] };
  cycle.children.push(cycle);
  expect(boundedProse(cycle)).toBe(false);
  expect(proseDocumentSchema.safeParse([cycle]).success).toBe(false);
  let deep: unknown = [];
  for (let index = 0; index <= PROSE_POLICY.maxDepth; index += 1) deep = [deep];
  expect(boundedProse(deep)).toBe(false);
});
it('bounds collections, object fields, total values and cumulative text', () => {
  expect(boundedProse(Array.from({ length: PROSE_POLICY.maxArrayLength + 1 }))).toBe(
    false,
  );
  expect(
    boundedProse(
      Object.fromEntries(
        Array.from(
          {
            length: PROSE_POLICY.maxObjectProperties + 1,
          },
          (_, index) => [String(index), index],
        ),
      ),
    ),
  ).toBe(false);
  const wide = Array.from({ length: PROSE_POLICY.maxArrayLength }, () =>
    Array.from({ length: 20 }, () => 0),
  );
  expect(boundedProse(wide)).toBe(false);
  expect(boundedProse(['x'.repeat(PROSE_POLICY.maxCharacters), 'x'])).toBe(false);
});
it('rejects class instances, symbols and accessors without executing getters', () => {
  expect(boundedProse(new Date())).toBe(false);
  expect(boundedProse({ [Symbol('unsupported')]: true })).toBe(false);
  const get = vi.fn<() => unknown>(() => []);
  expect(boundedProse(Object.defineProperty({}, 'children', { get }))).toBe(false);
  expect(get).not.toHaveBeenCalled();
  expect(
    boundedProse(
      Object.defineProperty({}, 'children', {
        set(_value: unknown) {},
      }),
    ),
  ).toBe(false);
  const plain: unknown = Object.setPrototypeOf(
    { type: 'paragraph', children: [] },
    null,
  );
  expect(boundedProse(plain)).toBe(true);
});
it('allows bounded plain values for the structural schema to validate', () => {
  expect(
    boundedProse([{ type: 'paragraph', children: [{ type: 'text', text: 'Text' }] }]),
  ).toBe(true);
  expect(boundedProse(null)).toBe(true);
});

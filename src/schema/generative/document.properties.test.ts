import fc from 'fast-check';
import { expect, it } from 'vitest';
import { parseDocumentJson, validateDocument } from '../../index.js';
import type { ReacdNode } from '../../index.js';
import { documentWith } from '../../../test-support/documents.js';

const text: fc.Arbitrary<ReacdNode> = fc
  .string({ maxLength: 500 })
  .map((content) => ({ type: 'Text', content }));
const node: fc.Arbitrary<ReacdNode> = fc
  .array(fc.array(text, { maxLength: 5 }), { maxLength: 5 })
  .chain((rows) =>
    fc.integer({ min: 1, max: 6 }).map((columns) => ({
      type: 'Grid',
      columns,
      spacing: 'small',
      children: rows.map((children) => ({ type: 'Card', children })),
    })),
  );

it('round-trips varied trees without changing Unicode content or layout intent', () => {
  fc.assert(
    fc.property(node, (root) => {
      const document = documentWith(root);
      expect(parseDocumentJson(JSON.stringify(document))).toEqual({
        success: true,
        data: document,
      });
    }),
    { numRuns: 200, seed: 20261028 },
  );
});

it('rejects unexpected rendering escape hatches for arbitrary text content', () => {
  fc.assert(
    fc.property(
      text,
      fc.constantFrom('className', 'style', 'html', 'onClick', 'children'),
      (root, field) => {
        expect(
          validateDocument({
            ...documentWith(root),
            root: { ...root, [field]: 'escape' },
          }).success,
        ).toBe(false);
      },
    ),
    { numRuns: 200, seed: 20261029 },
  );
});

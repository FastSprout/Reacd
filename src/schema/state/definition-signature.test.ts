import { expect, it } from 'vitest';
import { stateDefinitionsSchema } from './definitions.schema.js';
import { definitionSignature } from './definition-signature.js';

it('identifies state shape independently of order and initial values', () => {
  const initial = stateDefinitionsSchema.parse([
    { key: 'b', kind: 'text', initial: 'Initial', access: 'readWrite' },
    { key: 'a', kind: 'number', initial: 1, access: 'read' },
  ]);
  const reordered = stateDefinitionsSchema.parse([
    { key: 'a', kind: 'number', initial: 2, access: 'read' },
    { key: 'b', kind: 'text', initial: 'Changed', access: 'readWrite' },
  ]);
  expect(definitionSignature(initial)).toBe(definitionSignature(reordered));
  expect(definitionSignature(initial)).not.toBe(definitionSignature([]));
  expect(definitionSignature(initial)).not.toBe(
    definitionSignature(
      stateDefinitionsSchema.parse([
        { key: 'a', kind: 'number', initial: 1, access: 'readWrite' },
      ]),
    ),
  );
  const duplicate = stateDefinitionsSchema.parse([
    { key: 'a', kind: 'number', initial: 1, access: 'read' },
  ]);
  expect(definitionSignature([...duplicate, ...duplicate])).toContain('"key":"a"');
});

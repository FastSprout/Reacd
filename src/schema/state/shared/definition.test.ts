import { expect, it } from 'vitest';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { z } from 'zod';
import { stateKeySchema } from './definition.js';
import { stateDefinitionsSchema } from '../definitions.schema.js';
import { readStateBindingSchema, writeStateBindingSchema } from '../binding.schema.js';
import { editorDocumentSchema } from '../../editor/document/index.js';

it('rejects complete terminal line breaks across every reused key boundary', () => {
  for (const suffix of ['\n', '\r', '\r\n', '\u2028', '\u2029']) {
    const key = `value${suffix}`;
    expect(stateKeySchema.safeParse(key).success).toBe(false);
    expect(
      stateDefinitionsSchema.safeParse([
        { key, kind: 'text', initial: '', access: 'readWrite' },
      ]).success,
    ).toBe(false);
    expect(readStateBindingSchema.safeParse({ state: key, mode: 'read' }).success).toBe(
      false,
    );
    expect(
      writeStateBindingSchema.safeParse({ state: key, mode: 'readWrite' }).success,
    ).toBe(false);
    expect(
      editorDocumentSchema.safeParse({
        version: 1,
        blocks: [{ type: 'paragraph', id: key, content: [] }],
      }).success,
    ).toBe(false);
  }
  for (const key of ['value', 'customer.email', 'row-1', 'Option_2'])
    expect(stateKeySchema.safeParse(key).success).toBe(true);
});

it('exports the complete identifier boundary in portable JSON Schema', () => {
  const validate = new Ajv2020({ strict: true }).compile(
    z.toJSONSchema(stateKeySchema),
  );
  expect(validate('customer.email')).toBe(true);
  for (const suffix of ['\n', '\r', '\r\n', '\u2028', '\u2029'])
    expect(validate(`value${suffix}`)).toBe(false);
});

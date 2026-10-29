import { Ajv2020 } from 'ajv/dist/2020.js';
import { z } from 'zod';
import { expect, it } from 'vitest';
import { editorDocumentSchema } from './document.schema.js';

it('exports the strict recursive transport contract', () => {
  const schema = z.toJSONSchema(editorDocumentSchema, { target: 'draft-2020-12' });
  const validate = new Ajv2020({ strict: false }).compile(schema);
  const document = {
    version: 1,
    blocks: [
      { type: 'paragraph', id: 'intro', content: [{ type: 'text', text: 'Hello' }] },
    ],
  };
  expect(validate(document)).toBe(true);
  expect(validate({ ...document, html: '<div>' })).toBe(false);
  expect(validate({ version: 1, blocks: [{ type: 'html', id: 'intro' }] })).toBe(false);
  expect(
    validate({
      version: 1,
      blocks: [
        {
          type: 'paragraph',
          id: 'intro',
          content: [{ type: 'text', text: 'Hello', style: 'color:red' }],
        },
      ],
    }),
  ).toBe(false);
});

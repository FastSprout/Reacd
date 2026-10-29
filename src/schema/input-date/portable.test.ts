import { z } from 'zod';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { expect, it } from 'vitest';
import { inputDateNodeSchema } from './generative.schema.js';

it('exports required canonical references and closed mode/binding transport', () => {
  const validate = new Ajv2020({ strict: false }).compile(
    z.toJSONSchema(inputDateNodeSchema),
  );
  const node = {
    type: 'InputDate',
    label: 'Date',
    referenceDate: '2024-02-29',
    value: { state: 'date', mode: 'readWrite' },
  };
  expect(validate(node)).toBe(true);
  expect(validate({ ...node, mode: 'range' })).toBe(true);
  expect(validate({ ...node, referenceDate: undefined })).toBe(false);
  expect(validate({ ...node, referenceDate: '2024-2-29' })).toBe(false);
  expect(validate({ ...node, referenceDate: '2024-02-29T00:00:00Z' })).toBe(false);
  expect(validate({ ...node, className: 'native' })).toBe(false);
});

import { Ajv2020 } from 'ajv/dist/2020.js';
import { z } from 'zod';

const dateSchema = z.iso.date();

export function compileJsonSchema(schema: unknown) {
  if (schema === null || typeof schema !== 'object')
    throw new Error('Invalid JSON schema.');
  return new Ajv2020({ strict: true })
    .addFormat('date', {
      type: 'string',
      validate: (value: string) => dateSchema.safeParse(value).success,
    })
    .compile<unknown>(schema);
}

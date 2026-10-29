import { z } from 'zod';
import { stateDefinitionShape } from '../shared/definition.js';
import { numberValueSchema } from '../number/number.schema.js';
export const nullableNumberValueSchema = numberValueSchema.nullable();
export const nullableNumberStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('nullableNumber'),
    initial: nullableNumberValueSchema,
  })
  .readonly();

import { z } from 'zod';
import { stateDefinitionShape } from '../shared/definition.js';

export const booleanValueSchema = z.boolean();
export const booleanStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('boolean'),
    initial: booleanValueSchema,
  })
  .readonly();

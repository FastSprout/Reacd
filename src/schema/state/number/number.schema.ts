import { z } from 'zod';
import { stateDefinitionShape } from '../shared/definition.js';

export const numberValueSchema = z.number().finite();
export const numberStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('number'),
    initial: numberValueSchema,
  })
  .readonly();

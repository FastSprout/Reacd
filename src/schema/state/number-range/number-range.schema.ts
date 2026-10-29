import { z } from 'zod';
import { numberRangeSchema } from '../../number-range/index.js';
import { stateDefinitionShape } from '../shared/definition.js';

export const numberRangeStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('numberRange'),
    initial: numberRangeSchema,
  })
  .readonly();

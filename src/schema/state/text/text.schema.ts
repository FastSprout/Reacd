import { z } from 'zod';
import { textSchema } from '../../shared/values.js';
import { stateDefinitionShape } from '../shared/definition.js';

export const textStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('text'),
    initial: textSchema,
  })
  .readonly();

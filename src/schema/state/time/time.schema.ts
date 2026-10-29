import { z } from 'zod';
import { timeValueSchema } from '../../date-time/index.js';
import { stateDefinitionShape } from '../shared/definition.js';

export const timeStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('time'),
    initial: timeValueSchema,
  })
  .readonly();

import { z } from 'zod';
import { dateValueSchema } from '../../date-time/index.js';
import { stateDefinitionShape } from '../shared/definition.js';

export const dateStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('date'),
    initial: dateValueSchema,
  })
  .readonly();

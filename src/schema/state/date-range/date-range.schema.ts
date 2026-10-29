import { z } from 'zod';
import { dateRangeValueSchema } from '../../date-time/index.js';
import { stateDefinitionShape } from '../shared/definition.js';

export const dateRangeStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('dateRange'),
    initial: dateRangeValueSchema(),
  })
  .readonly();

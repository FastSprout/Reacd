import { z } from 'zod';
import { timeRangeValueSchema } from '../../date-time/index.js';
import { stateDefinitionShape } from '../shared/definition.js';

export const timeRangeStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('timeRange'),
    initial: timeRangeValueSchema(),
  })
  .readonly();

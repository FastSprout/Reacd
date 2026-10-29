import { z } from 'zod';
import { SORT_DIRECTIONS, STATE_POLICY } from '../../../core/state-policy.js';
import { stateDefinitionShape, stateKeySchema } from '../shared/definition.js';

const sortSchema = z
  .strictObject({
    column: stateKeySchema,
    direction: z.enum(SORT_DIRECTIONS),
  })
  .readonly();
export const sortingValueSchema = z
  .array(sortSchema)
  .max(STATE_POLICY.maxSorting)
  .refine(
    (sorts) => new Set(sorts.map((sort) => sort.column)).size === sorts.length,
    'Sorting columns must be unique.',
  )
  .readonly();
export const sortingStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('sorting'),
    initial: sortingValueSchema,
  })
  .readonly();

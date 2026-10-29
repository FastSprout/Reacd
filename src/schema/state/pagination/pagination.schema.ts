import { z } from 'zod';
import { STATE_POLICY } from '../../../core/state-policy.js';
import { stateDefinitionShape } from '../shared/definition.js';

export const paginationValueSchema = z
  .strictObject({
    pageIndex: z.number().int().min(0),
    pageSize: z.number().int().min(1).max(STATE_POLICY.maxPageSize),
  })
  .readonly();
export const paginationStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('pagination'),
    initial: paginationValueSchema,
  })
  .readonly();

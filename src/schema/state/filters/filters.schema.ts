import { z } from 'zod';
import { FILTER_OPERATORS, STATE_POLICY } from '../../../core/state-policy.js';
import {
  scalarSchema,
  stateDefinitionShape,
  stateKeySchema,
} from '../shared/definition.js';

const filterSchema = z
  .strictObject({
    column: stateKeySchema,
    operator: z.enum(FILTER_OPERATORS),
    value: scalarSchema,
  })
  .refine((filter) => {
    if (filter.operator === 'contains') return typeof filter.value === 'string';
    if (filter.operator === 'equals') return true;
    return typeof filter.value === 'number';
  }, 'Filter value does not match its operator.')
  .readonly();
export const filtersValueSchema = z
  .array(filterSchema)
  .max(STATE_POLICY.maxFilters)
  .refine(
    (filters) =>
      new Set(filters.map((filter) => `${filter.column}:${filter.operator}`)).size ===
      filters.length,
    'Duplicate filter rules.',
  )
  .readonly();
export const filtersStateSchema = z
  .strictObject({
    ...stateDefinitionShape,
    kind: z.literal('filters'),
    initial: filtersValueSchema,
  })
  .readonly();

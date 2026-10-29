import { z } from 'zod';
import { FRAMEWORK_ERRORS } from '../../core/errors.js';
import { SELECTION_POLICY } from '../../core/selection-policy.js';
import { textChangeSchema } from '../shared/values.js';
import { selectionKeySchema } from '../selection/index.js';
import { selectPropertiesSchema } from './properties.schema.js';

const single = selectPropertiesSchema
  .extend({
    mode: z.literal('single').optional(),
    value: z.union([z.literal(SELECTION_POLICY.emptySingleValue), selectionKeySchema]),
    onValueChange: textChangeSchema,
  })
  .refine(
    (props) =>
      props.value === SELECTION_POLICY.emptySingleValue ||
      props.items.some((item) => item.value === props.value),
    'Selected value must exist in the options.',
  );

const multiple = selectPropertiesSchema
  .extend({
    mode: z.literal('multiple'),
    value: z.array(selectionKeySchema).max(SELECTION_POLICY.maximumOptions).readonly(),
    onValueChange: z.custom<(value: readonly string[]) => void>(
      (value) => typeof value === 'function',
      FRAMEWORK_ERRORS.invalidCallback,
    ),
  })
  .refine(
    (props) =>
      new Set(props.value).size === props.value.length &&
      props.value.every((value) => props.items.some((item) => item.value === value)),
    'Selected values must be unique options.',
  );

export const selectSchema = z.discriminatedUnion('mode', [single, multiple]);

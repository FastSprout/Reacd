import { z } from 'zod';
import { inputNumberSchema } from './input-number.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import { INPUT_NUMBER_POLICY } from '../../core/input-number-policy.js';

const {
  onValueChange: _change,
  value: _value,
  ...properties
} = inputNumberSchema.shape;
export const inputNumberNodeSchema = z
  .strictObject({
    ...properties,
    type: z.literal('InputNumber'),
    value: stateBindingSchema,
  })
  .refine(
    (props) =>
      (props.min ?? INPUT_NUMBER_POLICY.minimum) <=
      (props.max ?? INPUT_NUMBER_POLICY.maximum),
    'Invalid numeric range.',
  );

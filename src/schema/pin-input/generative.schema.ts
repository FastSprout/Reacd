import { z } from 'zod';
import { pinInputSchema } from './pin-input.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { PIN_INPUT_POLICY } from '../../core/pin-input-policy.js';

const {
  onValueChange: _change,
  onComplete: _complete,
  value: _value,
  ...properties
} = pinInputSchema.shape;
export const pinInputNodeSchema = z
  .strictObject({
    ...properties,
    type: z.literal('PinInput'),
    value: stateBindingSchema,
    completeAction: stateKeySchema.optional(),
  })
  .refine(
    (props) =>
      props.separatorEvery === undefined ||
      props.separatorEvery < (props.length ?? PIN_INPUT_POLICY.length),
    'Invalid PIN grouping.',
  );

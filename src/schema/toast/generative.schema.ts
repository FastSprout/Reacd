import { z } from 'zod';
import { toastSchema, toastActionSchema } from './toast.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
const { onOpenChange: _change, ...properties } = toastSchema.shape;
export const toastNodeSchema = z.strictObject({
  ...properties,
  type: z.literal('Toast'),
  open: writeStateBindingSchema,
  action: z
    .strictObject({
      label: toastActionSchema.shape.label,
      action: stateKeySchema,
    })
    .optional(),
});

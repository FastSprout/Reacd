import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import {
  NAVIGATION_COMPOSITION_POLICY,
} from '../../core/navigation-composition-policy.js';
import { stepperItemSchema, stepperSchema } from './stepper.schema.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import { uniqueNavigationKeys } from '../navigation-shared/target.schema.js';

export interface StepperNode<Content> extends Omit<
  z.infer<typeof stepperSchema>,
  'items' | 'value' | 'onValueChange'
> {
  type: 'Stepper';
  value: z.infer<typeof stateBindingSchema>;
  items: readonly (Omit<z.infer<typeof stepperItemSchema>, 'content'> & {
    content?: Content[] | undefined;
  })[];
}

export function stepperNodeSchema<Content>(content: z.ZodType<Content>) {
  const { onValueChange: _change, ...shape } = stepperSchema.shape;
  return z.strictObject({
    ...shape,
    type: z.literal('Stepper'),
    value: stateBindingSchema,
    items: z
      .array(
        stepperItemSchema.extend({
          content: z.array(content).max(DOCUMENT_POLICY.maxChildren).optional(),
        }),
      )
      .min(NAVIGATION_COMPOSITION_POLICY.minimumSteps)
      .max(NAVIGATION_COMPOSITION_POLICY.maximumSteps)
      .refine(uniqueNavigationKeys, 'Step keys must be unique.')
      .readonly(),
  });
}

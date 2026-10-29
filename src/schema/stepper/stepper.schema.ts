import { z } from 'zod';
import {
  NAVIGATION_COMPOSITION_POLICY,
  NAVIGATION_ORIENTATIONS,
} from '../../core/navigation-composition-policy.js';
import { childrenSchema } from '../shared/children.js';
import { labelSchema, textChangeSchema, textSchema } from '../shared/values.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { uniqueNavigationKeys } from '../navigation-shared/target.schema.js';

export const stepperItemSchema = z.strictObject({
  key: stateKeySchema,
  title: labelSchema,
  description: textSchema.optional(),
  disabled: z.boolean().optional(),
  content: childrenSchema,
});

export function stepperValueSchema(
  items: readonly {
    key: string;
    disabled?: boolean | undefined;
  }[],
) {
  return stateKeySchema.refine(
    (value) => items.some((item) => item.key === value && !item.disabled),
    'The current step must identify an enabled item.',
  );
}

export const stepperSchema = z
  .strictObject({
    label: labelSchema,
    items: z
      .array(stepperItemSchema)
      .min(NAVIGATION_COMPOSITION_POLICY.minimumSteps)
      .max(NAVIGATION_COMPOSITION_POLICY.maximumSteps)
      .refine(uniqueNavigationKeys, 'Step keys must be unique.')
      .readonly(),
    value: stateKeySchema,
    onValueChange: textChangeSchema,
    orientation: z.enum(NAVIGATION_ORIENTATIONS).optional(),
    linear: z.boolean().optional(),
    disabled: z.boolean().optional(),
  })
  .refine(
    (properties) =>
      stepperValueSchema(properties.items).safeParse(properties.value).success,
    'The current step must identify an enabled item.',
  );

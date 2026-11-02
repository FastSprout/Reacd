import { z } from 'zod';
import { BUTTON_INTENTS } from '../../core/policy.js';
import { disabledSchema, labelSchema, pressSchema } from '../shared/values.js';
import { iconNameSchema } from '../icon/index.js';

export const buttonComponentSchema = z
  .strictObject({
    label: labelSchema,
    onPress: pressSchema,
    intent: z.enum(BUTTON_INTENTS).optional(),
    disabled: disabledSchema,
    pressed: z.boolean().optional(),
    leadingIcon: iconNameSchema.optional(),
    trailingIcon: iconNameSchema.optional(),
    iconOnly: z.boolean().optional(),
    loading: z.boolean().optional(),
    loadingLabel: labelSchema.optional(),
  })
  .refine(
    (value) =>
      !value.iconOnly ||
      value.leadingIcon !== undefined ||
      value.trailingIcon !== undefined,
    'Icon-only actions require a semantic icon and an accessible label.',
  );

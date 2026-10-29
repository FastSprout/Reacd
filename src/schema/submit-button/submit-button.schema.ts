import { z } from 'zod';
import { BUTTON_INTENTS } from '../../core/policy.js';
import { disabledSchema, labelSchema } from '../shared/values.js';

export const submitButtonSchema = z.strictObject({
  label: labelSchema,
  intent: z.enum(BUTTON_INTENTS).optional(),
  disabled: disabledSchema,
});

import { z } from 'zod';
import { CHAT_STATUSES } from '../../core/chat-policy.js';
import { labelSchema, pressSchema } from '../shared/values.js';

export const chatPromptSubmitSchema = z.strictObject({
  status: z.enum(CHAT_STATUSES).optional(),
  label: labelSchema.optional(),
  disabled: z.boolean().optional(),
  onSubmit: pressSchema.optional(),
  onStop: pressSchema.optional(),
  onRetry: pressSchema.optional(),
});

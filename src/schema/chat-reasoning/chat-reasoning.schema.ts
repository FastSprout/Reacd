import { z } from 'zod';
import { CHAT_FEEDBACK_POLICY } from '../../core/chat-feedback-policy.js';
import { booleanChangeSchema, labelSchema, textSchema } from '../shared/values.js';

export const chatReasoningSchema = z.strictObject({
  text: textSchema.max(CHAT_FEEDBACK_POLICY.maxSummaryLength),
  label: labelSchema.optional(),
  open: z.boolean(),
  onOpenChange: booleanChangeSchema,
  streaming: z.boolean().optional(),
  autoOpen: z.boolean().optional(),
  autoClose: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

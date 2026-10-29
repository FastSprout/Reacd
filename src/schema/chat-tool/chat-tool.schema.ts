import { z } from 'zod';
import {
  CHAT_FEEDBACK_POLICY,
  CHAT_TOOL_STATUSES,
  validToolActions,
} from '../../core/chat-feedback-policy.js';
import {
  booleanChangeSchema,
  labelSchema,
  pressSchema,
  textSchema,
} from '../shared/values.js';

export const chatToolContentSchema = z.strictObject({
  label: labelSchema,
  status: z.enum(CHAT_TOOL_STATUSES),
  input: textSchema.max(CHAT_FEEDBACK_POLICY.maxToolInputLength).optional(),
  output: z.string().max(CHAT_FEEDBACK_POLICY.maxToolOutputLength).optional(),
  error: textSchema.optional(),
  disabled: z.boolean().optional(),
});

export const chatToolSchema = chatToolContentSchema
  .extend({
    open: z.boolean(),
    onOpenChange: booleanChangeSchema,
    onApprove: pressSchema.optional(),
    onReject: pressSchema.optional(),
    onRetry: pressSchema.optional(),
  })
  .refine(
    (tool) =>
      validToolActions(
        tool.status,
        tool.onApprove !== undefined,
        tool.onReject !== undefined,
        tool.onRetry !== undefined,
      ),
    'Tool decisions require paired approval actions or an error retry.',
  );

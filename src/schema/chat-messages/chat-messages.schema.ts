import { z } from 'zod';
import { CHAT_POLICY, CHAT_STATUSES } from '../../core/chat-policy.js';
import { chatMessageSchema } from '../chat-message/index.js';
import { labelSchema, pressSchema, textSchema } from '../shared/values.js';

export const chatMessagesSettingsSchema = z.strictObject({
  label: labelSchema,
  status: z.enum(CHAT_STATUSES).optional(),
  error: textSchema.optional(),
  followLatest: z.boolean().optional(),
  emptyLabel: labelSchema.optional(),
});

export const chatMessagesSchema = chatMessagesSettingsSchema.extend({
  messages: z
    .array(chatMessageSchema)
    .max(CHAT_POLICY.maxMessages)
    .refine(
      (messages) =>
        new Set(messages.map((message) => message.id)).size === messages.length,
      'Chat message identifiers must be unique.',
    )
    .readonly(),
  onRetry: pressSchema.optional(),
});

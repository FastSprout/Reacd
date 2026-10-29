import { z } from 'zod';
import { CHAT_POLICY } from '../../core/chat-policy.js';
import { chatMessageLiteralSchema } from '../chat-message/generative.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { chatMessagesSettingsSchema } from './chat-messages.schema.js';

export const chatMessagesNodeSchema = chatMessagesSettingsSchema.extend({
  type: z.literal('ChatMessages'),
  messages: z
    .array(chatMessageLiteralSchema)
    .max(CHAT_POLICY.maxMessages)
    .refine(
      (messages) =>
        new Set(messages.map((message) => message.id)).size === messages.length,
      'Chat message identifiers must be unique.',
    )
    .readonly(),
  retryAction: stateKeySchema.optional(),
});

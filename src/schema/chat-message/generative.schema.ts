import { z } from 'zod';
import { CHAT_POLICY } from '../../core/chat-policy.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { chatActionSchema, chatMessageContentSchema } from './chat-message.schema.js';

export const chatMessageLiteralSchema = chatMessageContentSchema.extend({
  actions: z
    .array(chatActionSchema.omit({ onPress: true }).extend({ action: stateKeySchema }))
    .max(CHAT_POLICY.maxActions)
    .refine(
      (actions) => new Set(actions.map((action) => action.id)).size === actions.length,
      'Chat action identifiers must be unique within a message.',
    )
    .readonly()
    .optional(),
});
export const chatMessageNodeSchema = chatMessageLiteralSchema.extend({
  type: z.literal('ChatMessage'),
});

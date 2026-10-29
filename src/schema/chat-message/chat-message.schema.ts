import { z } from 'zod';
import {
  CHAT_MESSAGE_STATUSES,
  CHAT_POLICY,
  CHAT_ROLES,
} from '../../core/chat-policy.js';
import { chatAttachmentDataSchema } from '../chat-attachment/index.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { labelSchema, pressSchema, textSchema } from '../shared/values.js';

export const chatMessageContentSchema = z.strictObject({
  id: stateKeySchema,
  author: labelSchema,
  role: z.enum(CHAT_ROLES),
  content: textSchema.max(CHAT_POLICY.maxMessageLength),
  attachments: z
    .array(chatAttachmentDataSchema)
    .max(CHAT_POLICY.maxAttachments)
    .readonly()
    .optional(),
  status: z.enum(CHAT_MESSAGE_STATUSES).optional(),
  error: textSchema.optional(),
});

export const chatActionSchema = z.strictObject({
  id: stateKeySchema,
  label: labelSchema,
  onPress: pressSchema,
  disabled: z.boolean().optional(),
});

export const chatMessageSchema = chatMessageContentSchema.extend({
  actions: z
    .array(chatActionSchema)
    .max(CHAT_POLICY.maxActions)
    .refine(
      (actions) => new Set(actions.map((action) => action.id)).size === actions.length,
      'Chat action identifiers must be unique within a message.',
    )
    .readonly()
    .optional(),
});

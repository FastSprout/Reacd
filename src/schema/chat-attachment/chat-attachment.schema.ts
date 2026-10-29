import { z } from 'zod';
import { CHAT_ATTACHMENT_STATUSES, CHAT_POLICY } from '../../core/chat-policy.js';
import { avatarSourceSchema } from '../avatar/avatar.schema.js';
import { labelSchema, pressSchema, textSchema } from '../shared/values.js';

export const chatAttachmentDataSchema = z.strictObject({
  name: labelSchema.max(CHAT_POLICY.maxFileNameLength),
  mediaType: z
    .string()
    .max(CHAT_POLICY.maxMediaTypeLength)
    .toLowerCase()
    .regex(/^[\w!#$&^.+-]+\/[\w!#$&^.+-]+$/u),
  url: avatarSourceSchema.optional(),
  description: textSchema.optional(),
  status: z.enum(CHAT_ATTACHMENT_STATUSES).optional(),
});

export const chatAttachmentSchema = chatAttachmentDataSchema.extend({
  onRemove: pressSchema.optional(),
  disabled: z.boolean().optional(),
});

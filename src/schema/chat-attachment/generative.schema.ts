import { z } from 'zod';
import { stateKeySchema } from '../state/shared/definition.js';
import { chatAttachmentDataSchema } from './chat-attachment.schema.js';

export const chatAttachmentNodeSchema = chatAttachmentDataSchema.extend({
  type: z.literal('ChatAttachment'),
  removeAction: stateKeySchema.optional(),
  disabled: z.boolean().optional(),
});

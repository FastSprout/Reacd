import { z } from 'zod';
import { CHAT_COMPOSER_POLICY } from '../../core/chat-composer-policy.js';
import { CHAT_POLICY, CHAT_STATUSES } from '../../core/chat-policy.js';
import { chatAttachmentDataSchema } from '../chat-attachment/index.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { childrenSchema } from '../shared/children.js';
import {
  labelSchema,
  textSchema,
  textChangeSchema,
  pressSchema,
} from '../shared/values.js';

export const chatPromptAttachmentSchema = chatAttachmentDataSchema.extend({
  id: stateKeySchema,
  removable: z.boolean().optional(),
});
export const promptDraftSchema = z.string().max(CHAT_COMPOSER_POLICY.maxDraftLength);
export const chatPromptOptionsSchema = z.strictObject({
  label: labelSchema,
  placeholder: textSchema.optional(),
  description: textSchema.optional(),
  error: labelSchema.optional(),
  status: z.enum(CHAT_STATUSES).optional(),
  disabled: z.boolean().optional(),
  readOnly: z.boolean().optional(),
  submitOnEnter: z.boolean().optional(),
  attachments: z
    .array(chatPromptAttachmentSchema)
    .max(CHAT_POLICY.maxAttachments)
    .refine(
      (files) => new Set(files.map((file) => file.id)).size === files.length,
      'Prompt attachment identifiers must be unique.',
    )
    .readonly()
    .optional(),
});
export const chatPromptSchema = chatPromptOptionsSchema.extend({
  value: promptDraftSchema,
  onValueChange: textChangeSchema,
  onSubmit: textChangeSchema,
  onStop: pressSchema.optional(),
  onRetry: pressSchema.optional(),
  onClose: pressSchema.optional(),
  onRemoveAttachment: textChangeSchema.optional(),
  footer: childrenSchema,
});

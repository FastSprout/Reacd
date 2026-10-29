import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { CHAT_POLICY, CHAT_STATUSES } from '../../core/chat-policy.js';
import { readStateBindingSchema, stateBindingSchema } from '../state/binding.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import {
  chatPromptOptionsSchema,
  chatPromptAttachmentSchema,
} from './chat-prompt.schema.js';

export const chatPromptNodeBaseSchema = chatPromptOptionsSchema
  .omit({ attachments: true, status: true })
  .extend({
    type: z.literal('ChatPrompt'),
    value: stateBindingSchema,
    status: z.union([z.enum(CHAT_STATUSES), readStateBindingSchema]).optional(),
    submitAction: stateKeySchema,
    stopAction: stateKeySchema.optional(),
    retryAction: stateKeySchema.optional(),
    closeAction: stateKeySchema.optional(),
    attachments: z
      .array(
        chatPromptAttachmentSchema.omit({ removable: true }).extend({
          removeAction: stateKeySchema.optional(),
        }),
      )
      .max(CHAT_POLICY.maxAttachments)
      .refine(
        (files) => new Set(files.map((file) => file.id)).size === files.length,
        'Prompt attachment identifiers must be unique.',
      )
      .optional(),
  });
type PromptNodeData = z.infer<typeof chatPromptNodeBaseSchema>;
export interface ChatPromptNode<Child> extends PromptNodeData {
  footer?: Child[] | undefined;
}
export function chatPromptNodeSchema<Child extends z.ZodType>(child: Child) {
  return chatPromptNodeBaseSchema.extend({
    footer: z.array(child).max(DOCUMENT_POLICY.maxChildren).optional(),
  });
}

import { z } from 'zod';
import { validToolActions } from '../../core/chat-feedback-policy.js';
import { stateBindingSchema } from '../state/binding.schema.js';
import { stateKeySchema } from '../state/shared/definition.js';
import { chatToolContentSchema } from './chat-tool.schema.js';

export const chatToolNodeSchema = chatToolContentSchema
  .extend({
    type: z.literal('ChatTool'),
    open: stateBindingSchema,
    approveAction: stateKeySchema.optional(),
    rejectAction: stateKeySchema.optional(),
    retryAction: stateKeySchema.optional(),
  })
  .refine(
    (tool) =>
      validToolActions(
        tool.status,
        tool.approveAction !== undefined,
        tool.rejectAction !== undefined,
        tool.retryAction !== undefined,
      ),
    'Tool decisions require paired approval actions or an error retry.',
  );

import { z } from 'zod';
import { readStateBindingSchema, stateBindingSchema } from '../state/binding.schema.js';
import { chatReasoningSchema } from './chat-reasoning.schema.js';

export const chatReasoningNodeSchema = chatReasoningSchema
  .omit({ onOpenChange: true })
  .extend({
    type: z.literal('ChatReasoning'),
    open: stateBindingSchema,
    text: z.union([chatReasoningSchema.shape.text, readStateBindingSchema]),
  });

import { z } from 'zod';
import { stateKeySchema } from '../state/shared/definition.js';
import { chatPromptSubmitSchema } from './chat-prompt-submit.schema.js';

export const chatPromptSubmitNodeSchema = chatPromptSubmitSchema
  .omit({ onSubmit: true, onStop: true, onRetry: true })
  .extend({
    type: z.literal('ChatPromptSubmit'),
    submitAction: stateKeySchema.optional(),
    stopAction: stateKeySchema.optional(),
    retryAction: stateKeySchema.optional(),
  });

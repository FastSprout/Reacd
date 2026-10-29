import { z } from 'zod';
import { submitButtonSchema } from './submit-button.schema.js';

export const submitButtonNodeSchema = submitButtonSchema.extend({
  type: z.literal('SubmitButton'),
});

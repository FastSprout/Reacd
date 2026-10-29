import { z } from 'zod';
import { CONTENT_POLICY } from '../../core/policy.js';
import { labelSchema } from '../shared/values.js';

export const codeBlockSchema = z.strictObject({
  label: labelSchema,
  content: z.string().max(CONTENT_POLICY.maxCodeLength),
});

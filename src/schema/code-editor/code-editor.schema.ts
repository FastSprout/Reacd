import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { labelSchema, textChangeSchema } from '../shared/values.js';

export const codeEditorSchema = z.strictObject({
  label: labelSchema,
  value: z.string().max(DOCUMENT_POLICY.maxCharacters),
  onValueChange: textChangeSchema,
});

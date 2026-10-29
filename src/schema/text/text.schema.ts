import { z } from 'zod';
import { CONTENT_POLICY, TEXT_ROLES, TEXT_WEIGHTS } from '../../core/policy.js';
import { textSchema } from '../shared/values.js';

export const textComponentSchema = z.strictObject({
  children: z.union([textSchema, z.number().finite()]),
  role: z.enum(TEXT_ROLES).optional(),
  weight: z.enum(TEXT_WEIGHTS).optional(),
  lineLimit: z.number().int().min(1).max(CONTENT_POLICY.maxVisibleLines).optional(),
});

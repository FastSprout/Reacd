import { z } from 'zod';
import { CONTENT_POLICY } from '../../core/policy.js';
import { labelSchema } from '../shared/values.js';

const SAFE_LINK = /^(https?:\/\/[^\s]+|mailto:[^\s]+|\/(?!\/)[^\s]*|#[\w-]+)$/;

function safeHref(value: string): boolean {
  if (value.includes('\\') || /\p{Cc}/u.test(value)) return false;
  if (value.startsWith('/') || value.startsWith('#')) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const linkSchema = z.strictObject({
  label: labelSchema,
  active: z.boolean().optional(),
  disabled: z.boolean().optional(),
  newWindow: z.boolean().optional(),
  href: z
    .string()
    .max(CONTENT_POLICY.maxLinkLength)
    .regex(SAFE_LINK, 'Unsafe link target.')
    .refine(safeHref, 'Unsafe link target.'),
});

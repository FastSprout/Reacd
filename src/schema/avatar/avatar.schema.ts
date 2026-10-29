import { z } from 'zod';
import { AVATAR_POLICY, AVATAR_SIZES } from '../../core/avatar-policy.js';
import { avatarGraphemes } from '../../core/avatar-text.js';
import { CONTENT_POLICY } from '../../core/policy.js';
import { labelSchema } from '../shared/values.js';

export const avatarSourceSchema = z
  .string()
  .max(CONTENT_POLICY.maxLinkLength)
  .regex(/^(https?:\/\/[^\s\\]+|\/(?!\/)[^\s\\]*)$/u)
  .regex(/^\P{Cc}*$/u)
  .refine((value) => {
    try {
      const url = new URL(value, AVATAR_POLICY.sourceBase);
      return url.username === '' && url.password === '';
    } catch {
      return false;
    }
  }, 'Image source must be a valid HTTP(S) or root-relative URL without credentials.');
export const avatarSchema = z.strictObject({
  name: labelSchema,
  src: avatarSourceSchema.optional(),
  fallback: labelSchema
    .refine(
      (value) => avatarGraphemes(value).length <= AVATAR_POLICY.maxInitials,
      'Avatar fallback must fit within two Unicode graphemes.',
    )
    .optional(),
  size: z.enum(AVATAR_SIZES).optional(),
});

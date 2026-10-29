import { z } from 'zod';
import { AVATAR_SIZES } from '../../core/avatar-policy.js';
import { USER_ORIENTATIONS } from '../../core/user-policy.js';
import { avatarSchema } from '../avatar/avatar.schema.js';
import { linkSchema } from '../link/link.schema.js';
import { labelSchema, pressSchema, textSchema } from '../shared/values.js';

export const userContentSchema = z.strictObject({
  name: labelSchema,
  description: textSchema.optional(),
  avatar: avatarSchema.pick({ src: true, fallback: true }).optional(),
  size: z.enum(AVATAR_SIZES).optional(),
  orientation: z.enum(USER_ORIENTATIONS).optional(),
  href: linkSchema.shape.href.optional(),
});
export const userSchema = userContentSchema
  .extend({
    onPress: pressSchema.optional(),
    disabled: z.boolean().optional(),
  })
  .refine(
    (props) => props.href === undefined || props.onPress === undefined,
    'User supports either a link or an action.',
  )
  .refine(
    (props) => props.disabled === undefined || props.onPress !== undefined,
    'Disabled User requires an action.',
  );

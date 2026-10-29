import { z } from 'zod';
import { avatarGroupSchema } from './avatar-group.schema.js';
export const avatarGroupNodeSchema = avatarGroupSchema.extend({
  type: z.literal('AvatarGroup'),
});

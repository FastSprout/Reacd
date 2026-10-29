import type { z } from 'zod';
import type { avatarGroupSchema } from '../../schema/avatar-group/index.js';
export type AvatarGroupProps = z.infer<typeof avatarGroupSchema>;

import type { z } from 'zod';
import type { avatarSchema } from '../../schema/avatar/avatar.schema.js';
export type AvatarProps = z.infer<typeof avatarSchema>;

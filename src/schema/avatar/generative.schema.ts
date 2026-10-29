import { z } from 'zod';
import { avatarSchema } from './avatar.schema.js';
export const avatarNodeSchema = avatarSchema.extend({ type: z.literal('Avatar') });

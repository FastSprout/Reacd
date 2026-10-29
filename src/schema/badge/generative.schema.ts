import { z } from 'zod';
import { badgeSchema } from './badge.schema.js';

export const badgeNodeSchema = badgeSchema.extend({ type: z.literal('Badge') });

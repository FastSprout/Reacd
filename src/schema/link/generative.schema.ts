import { z } from 'zod';
import { linkSchema } from './link.schema.js';

export const linkNodeSchema = linkSchema.extend({ type: z.literal('Link') });

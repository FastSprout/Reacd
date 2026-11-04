import { z } from 'zod';
import { imageSchema } from './image.schema.js';

export const imageNodeSchema = imageSchema.extend({ type: z.literal('Image') });

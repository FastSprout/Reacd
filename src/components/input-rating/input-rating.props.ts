import type { z } from 'zod';
import type { inputRatingSchema } from '../../schema/input-rating/index.js';
export type InputRatingProps = z.infer<typeof inputRatingSchema>;

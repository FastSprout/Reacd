import type { z } from 'zod';
import type { imageSchema } from '../../schema/image/index.js';

export type ImageProps = z.infer<typeof imageSchema>;

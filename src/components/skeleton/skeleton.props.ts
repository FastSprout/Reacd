import type { z } from 'zod';
import type { skeletonSchema } from '../../schema/skeleton/skeleton.schema.js';
export type SkeletonProps = z.infer<typeof skeletonSchema>;

import { z } from 'zod';
import { skeletonSchema, validSkeletonLines } from './skeleton.schema.js';
import { readStateBindingSchema } from '../state/binding.schema.js';
export const skeletonNodeSchema = z
  .strictObject({
    ...skeletonSchema.shape,
    type: z.literal('Skeleton'),
    show: z.union([z.boolean(), readStateBindingSchema]).optional(),
  })
  .refine(validSkeletonLines, 'Only text skeletons accept line counts.');

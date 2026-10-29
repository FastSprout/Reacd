import { z } from 'zod';
import { PROGRESS_POLICY } from '../../core/element-policy.js';
import { progressSchema, progressValueSchema } from './progress.schema.js';
import { readStateBindingSchema } from '../state/binding.schema.js';

export const progressNodeSchema = z
  .strictObject({
    ...progressSchema.shape,
    type: z.literal('Progress'),
    value: z.union([progressValueSchema, readStateBindingSchema]),
  })
  .refine(
    (node) =>
      typeof node.value === 'object' ||
      node.value === undefined ||
      node.value <= (node.max ?? PROGRESS_POLICY.max),
    'Progress value must be within its maximum.',
  );

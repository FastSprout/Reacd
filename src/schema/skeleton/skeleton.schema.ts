import { z } from 'zod';
import {
  SKELETON_SHAPES,
  SKELETON_SIZES,
  SKELETON_POLICY,
  SKELETON_DEFAULTS,
} from '../../core/skeleton-policy.js';
import { labelSchema } from '../shared/values.js';

const skeletonPropertiesSchema = z.strictObject({
  shape: z.enum(SKELETON_SHAPES).optional(),
  size: z.enum(SKELETON_SIZES).optional(),
  lines: z
    .number()
    .int()
    .min(SKELETON_POLICY.minLines)
    .max(SKELETON_POLICY.maxLines)
    .optional(),
  label: labelSchema.optional(),
  animated: z.boolean().optional(),
  show: z.boolean().optional(),
});
export function validSkeletonLines(
  props: Pick<z.infer<typeof skeletonPropertiesSchema>, 'shape' | 'lines'>,
): boolean {
  return (
    (props.shape ?? SKELETON_DEFAULTS.shape) === 'text' || props.lines === undefined
  );
}
export const skeletonSchema = skeletonPropertiesSchema.refine(
  validSkeletonLines,
  'Only text skeletons accept line counts.',
);

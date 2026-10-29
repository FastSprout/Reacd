import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { tooltipProperties } from './tooltip.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';

export interface TooltipNode<Content> extends Omit<
  z.infer<z.ZodObject<typeof tooltipProperties>>,
  'children'
> {
  type: 'Tooltip';
  children: Content[];
  open?: z.infer<typeof writeStateBindingSchema> | undefined;
}
export function tooltipNodeSchema<Content>(content: z.ZodType<Content>) {
  return z.strictObject({
    ...tooltipProperties,
    type: z.literal('Tooltip'),
    children: z.array(content).min(1).max(DOCUMENT_POLICY.maxChildren),
    open: writeStateBindingSchema.optional(),
  });
}

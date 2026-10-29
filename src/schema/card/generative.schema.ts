import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import type { Spacing } from '../../core/policy.js';
import { labelSchema, spacingSchema } from '../shared/values.js';

export interface CardNode<Child> {
  type: 'Card';
  children: Child[];
  header?: Child[] | undefined;
  footer?: Child[] | undefined;
  label?: string | undefined;
  spacing?: Spacing | undefined;
}
export function cardNodeSchema<Child extends z.ZodType>(child: Child) {
  const nodes = z.array(child).max(DOCUMENT_POLICY.maxChildren);
  return z.strictObject({
    type: z.literal('Card'),
    children: nodes,
    header: nodes.optional(),
    footer: nodes.optional(),
    label: labelSchema.optional(),
    spacing: spacingSchema,
  });
}

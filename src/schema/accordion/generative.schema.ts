import { z } from 'zod';
import { accordionSchema, accordionItemsSchema } from './accordion.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';
import { CONTENT_POLICY } from '../../core/policy.js';

export interface AccordionNode<Content> extends Omit<
  z.infer<typeof accordionSchema>,
  'items' | 'value' | 'onValueChange'
> {
  type: 'Accordion';
  value: z.infer<typeof writeStateBindingSchema>;
  items: {
    value: string;
    label: string;
    content: Content;
    disabled?: boolean | undefined;
  }[];
}
export function accordionNodeSchema<Content>(content: z.ZodType<Content>) {
  const { onValueChange: _change, ...properties } = accordionSchema.shape;
  return z.strictObject({
    ...properties,
    type: z.literal('Accordion'),
    value: writeStateBindingSchema,
    items: accordionItemsSchema.element
      .extend({ content })
      .array()
      .min(1)
      .max(CONTENT_POLICY.maxOptions)
      .refine(
        (items) => new Set(items.map((item) => item.value)).size === items.length,
        'Accordion item values must be unique.',
      ),
  });
}

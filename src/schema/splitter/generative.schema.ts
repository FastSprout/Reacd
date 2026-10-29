import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { SPLITTER_POLICY } from '../../core/splitter-policy.js';
import { validPanelRange, validCollapsedShare } from '../../core/splitter.js';
import { splitterSchema, splitterPanelSchema } from './splitter.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';

export interface SplitterNode<Content> extends Omit<
  z.infer<typeof splitterSchema>,
  'panels' | 'value' | 'onValueChange'
> {
  type: 'Splitter';
  panels: readonly (Omit<z.infer<typeof splitterPanelSchema>, 'content'> & {
    content: Content[];
  })[];
  value: z.infer<typeof writeStateBindingSchema>;
}

export function splitterNodeSchema<Content>(content: z.ZodType<Content>) {
  const { onValueChange: _change, panels: _panels, ...shape } = splitterSchema.shape;
  const panel = z
    .strictObject({
      ...splitterPanelSchema.shape,
      content: z.array(content).max(DOCUMENT_POLICY.maxChildren),
    })
    .refine(validPanelRange, 'A panel minimum cannot exceed its maximum.')
    .refine(
      validCollapsedShare,
      'A collapsed share must be smaller than its expanded minimum.',
    );
  return z.strictObject({
    ...shape,
    type: z.literal('Splitter'),
    panels: z
      .array(panel)
      .min(SPLITTER_POLICY.minPanels)
      .max(SPLITTER_POLICY.maxPanels)
      .refine(
        (items) => new Set(items.map((item) => item.id)).size === items.length,
        'Panel identities must be unique.',
      )
      .readonly(),
    value: writeStateBindingSchema,
  });
}

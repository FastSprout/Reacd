import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { commandPaletteNodeSchema } from '../command-palette/generative.schema.js';
import { contentSearchSchema } from './content-search.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';

export interface ContentSearchNode<Content> extends Omit<
  z.infer<typeof commandPaletteNodeSchema>,
  'type'
> {
  type: 'ContentSearch';
  title: string;
  description?: string | undefined;
  open: z.infer<typeof writeStateBindingSchema>;
  triggerLabel?: string | undefined;
  closeLabel?: string | undefined;
  closeOnSelect?: boolean | undefined;
  footer?: Content[] | undefined;
}

export function contentSearchNodeSchema<Content>(content: z.ZodType<Content>) {
  const shape = contentSearchSchema.shape;
  return z
    .strictObject({
      ...commandPaletteNodeSchema.shape,
      type: z.literal('ContentSearch'),
      title: shape.title,
      description: shape.description,
      triggerLabel: shape.triggerLabel,
      closeLabel: shape.closeLabel,
      closeOnSelect: shape.closeOnSelect,
      open: writeStateBindingSchema,
      footer: z.array(content).max(DOCUMENT_POLICY.maxChildren).optional(),
    })
    .refine((node) => {
      const {
        type: _type,
        title: _title,
        description: _description,
        open: _open,
        triggerLabel: _trigger,
        closeLabel: _close,
        closeOnSelect: _closing,
        footer: _footer,
        ...command
      } = node;
      return commandPaletteNodeSchema.safeParse({
        ...command,
        type: 'CommandPalette',
      }).success;
    }, 'Invalid documentation command declaration.');
}

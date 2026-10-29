import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { headerSchema, headerMenuSchema } from './header.schema.js';
import { writeStateBindingSchema } from '../state/binding.schema.js';

export interface HeaderNode<Content> extends Omit<
  z.infer<typeof headerSchema>,
  'children' | 'start' | 'end' | 'top' | 'bottom' | 'menu'
> {
  type: 'Header';
  children: Content[];
  start?: Content[] | undefined;
  end?: Content[] | undefined;
  top?: Content[] | undefined;
  bottom?: Content[] | undefined;
  menu?:
    | (Omit<z.infer<typeof headerMenuSchema>, 'content' | 'open' | 'onOpenChange'> & {
        content: Content[];
        open: z.infer<typeof writeStateBindingSchema>;
      })
    | undefined;
}

export function headerNodeSchema<Content>(content: z.ZodType<Content>) {
  const slot = z.array(content).max(DOCUMENT_POLICY.maxChildren);
  const { onOpenChange: _change, ...menu } = headerMenuSchema.shape;
  return z.strictObject({
    ...headerSchema.shape,
    type: z.literal('Header'),
    children: slot,
    start: slot.optional(),
    end: slot.optional(),
    top: slot.optional(),
    bottom: slot.optional(),
    menu: z
      .strictObject({
        ...menu,
        content: slot,
        open: writeStateBindingSchema,
      })
      .optional(),
  });
}

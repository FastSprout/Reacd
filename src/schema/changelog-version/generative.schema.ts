import { z } from 'zod';
import { changelogVersionSchema } from './changelog-version.schema.js';
import { editorialTransportShape } from '../shared/editorial-transport.js';
import { validEditorialEntry } from '../shared/editorial.js';

export interface ChangelogVersionNode<Content> extends Omit<
  z.infer<typeof changelogVersionSchema>,
  'onPress' | 'children' | 'header' | 'badge' | 'authors' | 'footer' | 'actions'
> {
  type: 'ChangelogVersion';
  action?: string | undefined;
  children: Content[];
  header?: Content[] | undefined;
  badge?: Content[] | undefined;
  authors?: Content[] | undefined;
  footer?: Content[] | undefined;
  actions?: Content[] | undefined;
}

export function changelogVersionNodeSchema<Content>(content: z.ZodType<Content>) {
  return z
    .strictObject({
      ...editorialTransportShape(content),
      type: z.literal('ChangelogVersion'),
      indicator: z.boolean().optional(),
    })
    .refine(validEditorialEntry, 'Provide a named target and dated label.');
}

import { z } from 'zod';
import { blogPostSchema } from './blog-post.schema.js';
import { editorialTransportShape } from '../shared/editorial-transport.js';
import { validEditorialEntry } from '../shared/editorial.js';

export interface BlogPostNode<Content> extends Omit<
  z.infer<typeof blogPostSchema>,
  'onPress' | 'children' | 'header' | 'badge' | 'authors' | 'footer' | 'actions'
> {
  type: 'BlogPost';
  action?: string | undefined;
  children: Content[];
  header?: Content[] | undefined;
  badge?: Content[] | undefined;
  authors?: Content[] | undefined;
  footer?: Content[] | undefined;
  actions?: Content[] | undefined;
}

export function blogPostNodeSchema<Content>(content: z.ZodType<Content>) {
  return z
    .strictObject({
      ...editorialTransportShape(content),
      type: z.literal('BlogPost'),
    })
    .refine(validEditorialEntry, 'Provide a named target and dated label.');
}

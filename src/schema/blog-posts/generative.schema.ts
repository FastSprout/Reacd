import { z } from 'zod';
import { DOCUMENT_POLICY } from '../../core/policy.js';
import { blogPostsSchema } from './blog-posts.schema.js';
import { blogPostNodeSchema } from '../blog-post/generative.schema.js';
import type { BlogPostNode } from '../blog-post/generative.schema.js';
import { identifierSchema } from '../shared/identifier.js';
import { uniqueEditorialKeys, validEditorialEntry } from '../shared/editorial.js';

export interface BlogPostsNode<Content> extends Omit<
  z.infer<typeof blogPostsSchema>,
  'posts' | 'children'
> {
  type: 'BlogPosts';
  posts?:
    readonly (Omit<BlogPostNode<Content>, 'type'> & { key: string })[] | undefined;
  children: Content[];
}

export function blogPostsNodeSchema<Content>(content: z.ZodType<Content>) {
  const { type: _type, ...entry } = blogPostNodeSchema(content).shape;
  const item = z
    .strictObject({ ...entry, key: identifierSchema })
    .refine(validEditorialEntry, 'Provide a named target and dated label.');
  return z.strictObject({
    ...blogPostsSchema.shape,
    type: z.literal('BlogPosts'),
    posts: z
      .array(item)
      .max(DOCUMENT_POLICY.maxChildren)
      .refine(uniqueEditorialKeys, 'Editorial keys must be unique.')
      .readonly()
      .optional(),
    children: z.array(content).max(DOCUMENT_POLICY.maxChildren),
  });
}

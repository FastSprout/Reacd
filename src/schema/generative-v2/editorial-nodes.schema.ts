import type { z } from 'zod';
import { blogPostNodeSchema } from '../blog-post/generative.schema.js';
import type { BlogPostNode } from '../blog-post/generative.schema.js';
import { blogPostsNodeSchema } from '../blog-posts/generative.schema.js';
import type { BlogPostsNode } from '../blog-posts/generative.schema.js';
import { changelogVersionNodeSchema } from '../changelog-version/generative.schema.js';
import type { ChangelogVersionNode } from '../changelog-version/generative.schema.js';
import { changelogVersionsNodeSchema }
  from '../changelog-versions/generative.schema.js';
import type { ChangelogVersionsNode } from '../changelog-versions/generative.schema.js';

export type EditorialNode<Content> =
  | BlogPostNode<Content>
  | BlogPostsNode<Content>
  | ChangelogVersionNode<Content>
  | ChangelogVersionsNode<Content>;

export function editorialNodeSchemas<Content>(content: z.ZodType<Content>) {
  return [
    blogPostNodeSchema(content),
    blogPostsNodeSchema(content),
    changelogVersionNodeSchema(content),
    changelogVersionsNodeSchema(content),
  ] as const;
}

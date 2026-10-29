import type { z } from 'zod';
import type { blogPostSchema } from '../../schema/blog-post/blog-post.schema.js';

export type BlogPostProps = z.infer<typeof blogPostSchema>;

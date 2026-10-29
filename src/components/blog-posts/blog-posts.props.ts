import type { z } from 'zod';
import type { blogPostsSchema } from '../../schema/blog-posts/blog-posts.schema.js';

export type BlogPostsProps = z.infer<typeof blogPostsSchema>;

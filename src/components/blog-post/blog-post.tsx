import type { ReactNode } from 'react';
import type { BlogPostProps } from './blog-post.props.js';
import { blogPostSchema } from '../../schema/blog-post/blog-post.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { BlogPostProps } from './blog-post.props.js';
export function BlogPost(props: BlogPostProps): ReactNode {
  return useDeclaration('BlogPost', blogPostSchema, props);
}

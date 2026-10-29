import type { ReactNode } from 'react';
import type { BlogPostsProps } from './blog-posts.props.js';
import { blogPostsSchema } from '../../schema/blog-posts/blog-posts.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { BlogPostsProps } from './blog-posts.props.js';
export function BlogPosts(props: BlogPostsProps): ReactNode {
  return useDeclaration('BlogPosts', blogPostsSchema, props);
}

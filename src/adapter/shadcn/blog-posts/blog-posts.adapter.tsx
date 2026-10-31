import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/blog-posts/blog-posts.adapter.js';
import { SharedBlogPosts } from '../../shared/blog-posts/blog-posts.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnBlogPostsProps = ComponentProps<typeof SharedBlogPosts>;
export const ShadcnBlogPosts: ComponentType<ShadcnBlogPostsProps> = bindPrimitives(
  SharedBlogPosts,
  shadcnPrimitives,
  'ShadcnBlogPosts',
);

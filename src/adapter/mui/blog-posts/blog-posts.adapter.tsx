import type { ComponentProps, ComponentType } from 'react';
import { SharedBlogPosts } from '../../shared/blog-posts/blog-posts.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiBlogPostsProps = ComponentProps<typeof SharedBlogPosts>;
export const MuiBlogPosts: ComponentType<MuiBlogPostsProps> = bindPrimitives(
  SharedBlogPosts,
  muiPrimitives,
  'MuiBlogPosts',
);

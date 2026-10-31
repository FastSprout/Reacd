import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/blog-post/blog-post.adapter.js';
import { SharedBlogPost } from '../../shared/blog-post/blog-post.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnBlogPostProps = ComponentProps<typeof SharedBlogPost>;
export const ShadcnBlogPost: ComponentType<ShadcnBlogPostProps> = bindPrimitives(
  SharedBlogPost,
  shadcnPrimitives,
  'ShadcnBlogPost',
);

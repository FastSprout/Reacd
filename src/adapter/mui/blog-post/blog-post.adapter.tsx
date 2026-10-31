import type { ComponentProps, ComponentType } from 'react';
import { SharedBlogPost } from '../../shared/blog-post/blog-post.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiBlogPostProps = ComponentProps<typeof SharedBlogPost>;
export const MuiBlogPost: ComponentType<MuiBlogPostProps> = bindPrimitives(
  SharedBlogPost,
  muiPrimitives,
  'MuiBlogPost',
);

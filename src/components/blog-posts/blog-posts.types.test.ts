import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { BlogPosts } from './blog-posts.js';
import type { BlogPostsProps } from './blog-posts.props.js';

it('keeps the BlogPosts public contract closed and named', () => {
  expectTypeOf<Parameters<typeof BlogPosts>[0]>().toEqualTypeOf<BlogPostsProps>();
  expectTypeOf<ReturnType<typeof BlogPosts>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'style' | 'className' | 'onClick', keyof BlogPostsProps>
  >().toBeNever();
});

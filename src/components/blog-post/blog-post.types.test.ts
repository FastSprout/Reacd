import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { BlogPost } from './blog-post.js';
import type { BlogPostProps } from './blog-post.props.js';

it('keeps the BlogPost public contract closed and named', () => {
  expectTypeOf<Parameters<typeof BlogPost>[0]>().toEqualTypeOf<BlogPostProps>();
  expectTypeOf<ReturnType<typeof BlogPost>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'style' | 'className' | 'onClick', keyof BlogPostProps>
  >().toBeNever();
});

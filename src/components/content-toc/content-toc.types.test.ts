import type { ReactNode } from 'react';
import { expectTypeOf, it } from 'vitest';
import { ContentToc } from './content-toc.js';
import type { ContentTocProps } from './content-toc.props.js';

it('exposes a named closed ContentToc contract', () => {
  expectTypeOf<Parameters<typeof ContentToc>[0]>()
    .toEqualTypeOf<ContentTocProps>();
  expectTypeOf<ReturnType<typeof ContentToc>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<Extract<'style' | 'className' | 'as' | 'onClick',
    keyof ContentTocProps>>().toBeNever();
});

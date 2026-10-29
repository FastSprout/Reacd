import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChangelogVersion } from './changelog-version.js';
import type { ChangelogVersionProps } from './changelog-version.props.js';

it('keeps the ChangelogVersion public contract closed and named', () => {
  expectTypeOf<
    Parameters<typeof ChangelogVersion>[0]
  >().toEqualTypeOf<ChangelogVersionProps>();
  expectTypeOf<ReturnType<typeof ChangelogVersion>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'style' | 'className' | 'onClick', keyof ChangelogVersionProps>
  >().toBeNever();
});

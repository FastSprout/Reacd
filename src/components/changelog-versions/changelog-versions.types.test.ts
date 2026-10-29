import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { ChangelogVersions } from './changelog-versions.js';
import type { ChangelogVersionsProps } from './changelog-versions.props.js';

it('keeps the ChangelogVersions public contract closed and named', () => {
  expectTypeOf<
    Parameters<typeof ChangelogVersions>[0]
  >().toEqualTypeOf<ChangelogVersionsProps>();
  expectTypeOf<ReturnType<typeof ChangelogVersions>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'style' | 'className' | 'onClick', keyof ChangelogVersionsProps>
  >().toBeNever();
});

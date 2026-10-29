import type { ReactNode } from 'react';
import { expectTypeOf, it } from 'vitest';
import { Tabs } from './tabs.js';
import type { TabsProps } from './tabs.props.js';

it('exposes named closed tab and item contracts', () => {
  expectTypeOf<Parameters<typeof Tabs>[0]>().toEqualTypeOf<TabsProps>();
  expectTypeOf<ReturnType<typeof Tabs>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<'as' | 'style' | 'className' | 'onClick', keyof TabsProps>
  >().toBeNever();
  expectTypeOf<
    Extract<'as' | 'style' | 'className' | 'onClick', keyof TabsProps['items'][number]>
  >().toBeNever();
});

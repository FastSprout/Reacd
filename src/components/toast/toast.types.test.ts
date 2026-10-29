import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Toast } from './toast.js';
import type { ToastProps } from './toast.props.js';
it('exposes named closed props and synchronous logical callbacks', () => {
  expectTypeOf<Parameters<typeof Toast>[0]>().toEqualTypeOf<ToastProps>();
  expectTypeOf<ReturnType<typeof Toast>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<ToastProps['duration']>().toEqualTypeOf<
    'normal' | 'long' | 'persistent' | undefined
  >();
  expectTypeOf<
    Extract<'style' | 'className' | 'onClick' | 'toastManager', keyof ToastProps>
  >().toBeNever();
  expectTypeOf<NonNullable<ToastProps['action']>['onPress']>().toEqualTypeOf<
    () => boolean | void
  >();
  expectTypeOf<() => Promise<void>>().not.toMatchTypeOf<
    NonNullable<ToastProps['action']>['onPress']
  >();
  expectTypeOf<(value: boolean) => Promise<void>>().not.toMatchTypeOf<
    ToastProps['onOpenChange']
  >();
});

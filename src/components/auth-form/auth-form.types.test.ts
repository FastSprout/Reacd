import type { ReactNode } from 'react';
import { expectTypeOf, it } from 'vitest';
import { AuthForm } from './auth-form.js';
import type { AuthFormProps } from './auth-form.props.js';

it('exports named closed AuthForm props and logical callbacks', () => {
  expectTypeOf<Parameters<typeof AuthForm>[0]>().toEqualTypeOf<AuthFormProps>();
  expectTypeOf<ReturnType<typeof AuthForm>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<AuthFormProps['onSubmit']>().toEqualTypeOf<() => void>();
  expectTypeOf<
    Extract<'className' | 'style' | 'as' | 'onClick', keyof AuthFormProps>
  >().toBeNever();
});

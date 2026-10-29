import { expectTypeOf, it } from 'vitest';
import type { ListboxProps } from './listbox.props.js';

type Single = Exclude<ListboxProps, { mode: 'multiple' }>;
type Multiple = Extract<ListboxProps, { mode: 'multiple' }>;

it('exposes named mode-specific values and accurately vetoable requests', () => {
  expectTypeOf<Single['value']>().toEqualTypeOf<string>();
  expectTypeOf<Multiple['value']>().toEqualTypeOf<readonly string[]>();
  expectTypeOf<Single['onValueChange']>().returns.toEqualTypeOf<boolean | void>();
  expectTypeOf<Multiple['onValueChange']>()
    .parameter(0)
    .toEqualTypeOf<readonly string[]>();
  expectTypeOf<(value: string) => void>().toExtend<Single['onValueChange']>();
  expectTypeOf<(value: string) => Promise<boolean>>().not.toExtend<
    Single['onValueChange']
  >();
});

it('has no native or alternative selection dialect escape', () => {
  type Escapes = Extract<
    keyof ListboxProps,
    | 'className'
    | 'style'
    | 'children'
    | 'ref'
    | 'defaultValue'
    | 'orientation'
    | 'max'
    | 'multiple'
  >;
  expectTypeOf<Escapes>().toEqualTypeOf<never>();
});

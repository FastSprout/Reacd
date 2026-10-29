import { expectTypeOf, it } from 'vitest';
import type { TableProps, InteractiveTableProps, StaticTableProps } from './index.js';
it('offers closed static and controlled model contracts', () => {
  expectTypeOf<
    Extract<TableProps, { mode: 'interactive' }>
  >().toEqualTypeOf<InteractiveTableProps>();
  expectTypeOf<StaticTableProps['mode']>().toEqualTypeOf<'static' | undefined>();
  expectTypeOf<InteractiveTableProps['onModelChange']>().toEqualTypeOf<
    ((model: InteractiveTableProps['model']) => void) | undefined
  >();
  expectTypeOf<
    Extract<'style' | 'className' | 'renderCell', keyof TableProps>
  >().toEqualTypeOf<never>();
});

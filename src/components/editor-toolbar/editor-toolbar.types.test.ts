import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { EditorToolbar } from './editor-toolbar.js';
import type { EditorToolbarProps } from './editor-toolbar.props.js';

it('exposes named toolbar properties without arbitrary command callbacks', () => {
  expectTypeOf<
    Parameters<typeof EditorToolbar>[0]
  >().toEqualTypeOf<EditorToolbarProps>();
  expectTypeOf<ReturnType<typeof EditorToolbar>>().toEqualTypeOf<ReactNode>();
  expectTypeOf<
    Extract<
      'style' | 'className' | 'html' | 'render' | 'onClick' | 'onCommand' | 'editor',
      keyof EditorToolbarProps
    >
  >().toBeNever();
});

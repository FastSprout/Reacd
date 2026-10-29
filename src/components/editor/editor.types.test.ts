import { expectTypeOf, it } from 'vitest';
import type { ReactNode } from 'react';
import { Editor } from './editor.js';
import type { EditorProps } from './editor.props.js';
import type { EditorEdit } from '../../core/editor-edit.js';
import type { EditorDocument } from '../../core/editor-document.js';

it('exposes named closed properties and immutable domain callbacks', () => {
  expectTypeOf<Parameters<typeof Editor>[0]>().toEqualTypeOf<EditorProps>();
  expectTypeOf<ReturnType<typeof Editor>>().toEqualTypeOf<ReactNode>();
  type Private = Extract<EditorProps, { onValueChange: unknown }>;
  type Controlled = Extract<EditorProps, { onEditChange: unknown }>;
  expectTypeOf<Parameters<Private['onValueChange']>>().toEqualTypeOf<
    [document: EditorDocument]
  >();
  expectTypeOf<Parameters<Controlled['onEditChange']>>().toEqualTypeOf<
    [edit: EditorEdit]
  >();
  expectTypeOf<
    Omit<Controlled, 'onValueChange'> & {
      onValueChange: (value: EditorDocument) => void;
    }
  >().not.toExtend<EditorProps>();
  expectTypeOf<
    Omit<Private, 'selection'> & { selection: EditorEdit['selection'] }
  >().not.toExtend<EditorProps>();
  expectTypeOf<
    Parameters<Private['onValueChange']>[0]
  >().toEqualTypeOf<EditorDocument>();
  expectTypeOf<
    Extract<
      | 'style'
      | 'className'
      | 'html'
      | 'extensions'
      | 'render'
      | 'onKeyDown'
      | 'onInput'
      | 'onChange'
      | 'editor',
      keyof EditorProps
    >
  >().toBeNever();
});

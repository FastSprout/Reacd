import { expectTypeOf, it } from 'vitest';
import type {
  EditorBlock,
  EditorDocument,
  EditorInline,
  EditorListItem,
  EditorPosition,
  EditorSelection,
} from './editor-document.js';

type Equal<First, Second> =
  (<Value>() => Value extends First ? 1 : 2) extends <Value>() => Value extends Second
    ? 1
    : 2
    ? true
    : false;
type WritableKeys<Value> = {
  [Key in keyof Value]-?: Equal<
    { [Property in Key]: Value[Property] },
    { -readonly [Property in Key]: Value[Property] }
  > extends true
    ? Key
    : never;
}[keyof Value];
type ObjectWrites<Value> = Value extends object ? WritableKeys<Value> : never;
type DocumentObjects =
  | EditorDocument
  | EditorBlock
  | EditorInline
  | EditorListItem
  | EditorPosition
  | EditorSelection;

it('exposes no mutable properties at any document or selection node', () => {
  expectTypeOf<ObjectWrites<DocumentObjects>>().toBeNever();
  expectTypeOf<EditorDocument['blocks']>().toEqualTypeOf<readonly EditorBlock[]>();
});

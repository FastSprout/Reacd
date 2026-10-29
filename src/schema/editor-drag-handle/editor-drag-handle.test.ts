import { expect, expectTypeOf, it } from 'vitest';
import { editorDragHandleSchema, editorDragHandleNodeSchema } from './index.js';
import type * as Handle from '../../components/editor-drag-handle/index.js';
it('accepts only logical scope selection and protection properties', () => {
  expect(editorDragHandleSchema.safeParse({ label: 'Block actions' }).success).toBe(
    true,
  );
  expect(
    editorDragHandleSchema.safeParse({
      label: 'Block actions',
      blockId: 'nested.one',
      disabled: true,
    }).success,
  ).toBe(true);
  for (const properties of [
    {},
    { label: '' },
    { label: 'Block', blockId: '#native-selector' },
    { label: 'Block', onDragStart: () => undefined },
    { label: 'Block', children: 'native' },
    { label: 'Block', style: {} },
  ])
    expect(editorDragHandleSchema.safeParse(properties).success).toBe(false);
  expect(
    editorDragHandleNodeSchema.safeParse({
      type: 'EditorDragHandle',
      label: 'Move block',
    }).success,
  ).toBe(true);
  expectTypeOf<Handle.EditorDragHandleProps>().not.toHaveProperty('onDragStart');
  expectTypeOf<Handle.EditorDragHandleProps>().not.toHaveProperty('className');
});

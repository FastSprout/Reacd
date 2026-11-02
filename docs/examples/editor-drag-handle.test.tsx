import { act, render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { editorSchema } from '../../src/schema/editor/editor.schema.js';
import { editorDragHandleSchema } from
  '../../src/schema/editor-drag-handle/editor-drag-handle.schema.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { buttonComponentSchema as buttonSchema } from
  '../../src/schema/button/button.schema.js';
import { appSchema } from '../../src/schema/app/app.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { EditorDragHandleExample } from './editor-drag-handle.js';

it(
  'reports native unavailability and preserves atomic host ordering/protection',
  () => {
  expectUnsupportedExample(<EditorDragHandleExample />, 'Editor');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <EditorDragHandleExample />
    </probe.Surface>,
  );
  const read = () => {
    const value = probe.read('Editor', editorSchema, 'Block reorder document');
    if (!('onEditChange' in value)) throw new Error('Expected atomic edit callback');
    return value;
  };
  const initial = { value: read().value, selection: read().selection };
  expect(
    probe.read('EditorDragHandle', editorDragHandleSchema, 'Review block').blockId,
  ).toBe('review');
  const blocks = initial.value.blocks;
  const prepare = blocks[0];
  const review = blocks[1];
  const publish = blocks[2];
  if (!prepare || !review || !publish) throw new Error('Missing source blocks');
  const moved = {
    value: { ...initial.value, blocks: [review, prepare, publish] },
    selection: initial.selection,
  };
  act(() => read().onEditChange(moved));
  expect(read().value.blocks.map((block) => block.id)).toEqual([
    'review',
    'prepare',
    'publish',
  ]);
  const toggle = (label: string) =>
    act(() => {
      const value = probe.read('Toggle', toggleSchema, label);
      value.onCheckedChange(true);
    });
  toggle('Reject block moves');
  act(() => read().onEditChange(initial));
  expect(read().value).toEqual(moved.value);
  toggle('Read-only block document');
  toggle('Disable block document');
  toggle('Right to left block controls');
  expect(read()).toMatchObject({ readOnly: true, disabled: true });
  expect(probe.read('App', appSchema).direction).toBe('rtl');
  act(() => probe.read('Button', buttonSchema, 'Restore block order').onPress());
  expect(read().value).toEqual(initial.value);
  expect(read().selection).toEqual(initial.selection);
});

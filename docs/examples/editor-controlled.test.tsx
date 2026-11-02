import { act, render } from '@testing-library/react';
import type { EditorEdit } from '@fastsprout/reacd';
import { expect, it } from 'vitest';
import { editorSchema } from '../../src/schema/editor/editor.schema.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { buttonComponentSchema as buttonSchema } from
  '../../src/schema/button/button.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { EditorControlledExample } from './editor-controlled.js';

it('reports native unavailability and retains atomic document/selection vetoes', () => {
  expectUnsupportedExample(<EditorControlledExample />, 'Editor');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <EditorControlledExample />
    </probe.Surface>,
  );
  const read = () => {
    const value = probe.read('Editor', editorSchema, 'Controlled notes');
    if (!('onEditChange' in value)) throw new Error('Expected atomic edit callback');
    return value;
  };
  const initial = { value: read().value, selection: read().selection };
  const split: EditorEdit = {
    value: {
      version: 1,
      blocks: [
        ...initial.value.blocks,
        { type: 'paragraph', id: 'second', content: [] },
      ],
    },
    selection: {
      anchor: { blockId: 'second', offset: 0 },
      focus: { blockId: 'second', offset: 0 },
    },
  };
  act(() => read().onEditChange(split));
  expect({ value: read().value, selection: read().selection }).toEqual(split);
  expect(probe.texts()).toContain('Accepted blocks: 2');
  act(() => read().onEditChange(initial));
  expect(probe.texts()).toContain('Accepted blocks: 1');
  act(() =>
    probe.read('Toggle', toggleSchema, 'Reject atomic edits').onCheckedChange(true),
  );
  act(() => read().onEditChange(split));
  expect({ value: read().value, selection: read().selection }).toEqual(initial);
  expect(probe.texts()).toContain('Atomic edit requests: 3');
  act(() => probe.read('Button', buttonSchema, 'Restore atomic draft').onPress());
  expect({ value: read().value, selection: read().selection }).toEqual(initial);
  expect(probe.texts()).toContain('Atomic edit requests: 0');
});

import { act, render } from '@testing-library/react';
import type { EditorDocument } from '@fastsprout/reacd';
import { expect, it } from 'vitest';
import { editorSchema } from '../../src/schema/editor/editor.schema.js';
import { editorMentionMenuSchema } from
  '../../src/schema/editor-mention-menu/editor-mention-menu.schema.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { buttonComponentSchema as buttonSchema } from
  '../../src/schema/button/button.schema.js';
import { appSchema } from '../../src/schema/app/app.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { EditorMentionMenuExample } from './editor-mention-menu.js';

it(
  'reports native unavailability and preserves accepted document/menu metadata',
  () => {
  expectUnsupportedExample(<EditorMentionMenuExample />, 'Editor');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <EditorMentionMenuExample />
    </probe.Surface>,
  );
  const read = () => {
    const value = probe.read('Editor', editorSchema, 'Mention document');
    if (!('onValueChange' in value)) throw new Error('Expected document callback');
    return value;
  };
  const initial = read().value;
  const menu = probe.read(
    'EditorMentionMenu',
    editorMentionMenuSchema,
    'Example person options',
  );
  if (!('items' in menu)) throw new Error('Expected literal mention catalog');
  expect(menu.items.map((item) => item.id)).toEqual(['person', 'other']);
  expect(menu.items[1]?.disabled).toBe(true);
  const proposal: EditorDocument = {
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'intro',
        content: [{ type: 'mention', id: 'person', label: 'Example person' }],
      },
    ],
  };
  act(() => read().onValueChange(proposal));
  expect(read().value).toEqual(proposal);
  act(() =>
    probe
      .read('Toggle', toggleSchema, 'Read-only editor-mention-menu')
      .onCheckedChange(true),
  );
  expect(read().readOnly).toBe(true);
  act(() =>
    probe
      .read('Toggle', toggleSchema, 'Read-only editor-mention-menu')
      .onCheckedChange(false),
  );
  act(() =>
    probe
      .read('Toggle', toggleSchema, 'Right to left editor-mention-menu')
      .onCheckedChange(true),
  );
  expect(probe.read('App', appSchema).direction).toBe('rtl');
  act(() => probe.read('Button', buttonSchema, 'Reset editor-mention-menu').onPress());
  expect(read().value).toEqual(initial);
});

import { act, render } from '@testing-library/react';
import type { EditorDocument } from '@fastsprout/reacd';
import { expect, it } from 'vitest';
import { editorSchema } from '../../src/schema/editor/editor.schema.js';
import { editorEmojiMenuSchema } from
  '../../src/schema/editor-emoji-menu/editor-emoji-menu.schema.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { buttonComponentSchema as buttonSchema } from
  '../../src/schema/button/button.schema.js';
import { appSchema } from '../../src/schema/app/app.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { EditorEmojiMenuExample } from './editor-emoji-menu.js';

it(
  'reports native unavailability and preserves accepted document/menu metadata',
  () => {
  expectUnsupportedExample(<EditorEmojiMenuExample />, 'Editor');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <EditorEmojiMenuExample />
    </probe.Surface>,
  );
  const read = () => {
    const value = probe.read('Editor', editorSchema, 'Emoji document');
    if (!('onValueChange' in value)) throw new Error('Expected document callback');
    return value;
  };
  const initial = read().value;
  const menu = probe.read('EditorEmojiMenu', editorEmojiMenuSchema, 'Wave options');
  expect(menu.items.map((item) => item.name)).toEqual(['wave', 'check']);
  const proposal: EditorDocument = {
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'intro',
        content: [{ type: 'emoji', name: 'wave', value: '👋' }],
      },
    ],
  };
  act(() => read().onValueChange(proposal));
  expect(read().value).toEqual(proposal);
  act(() =>
    probe
      .read('Toggle', toggleSchema, 'Read-only editor-emoji-menu')
      .onCheckedChange(true),
  );
  expect(read().readOnly).toBe(true);
  act(() =>
    probe
      .read('Toggle', toggleSchema, 'Read-only editor-emoji-menu')
      .onCheckedChange(false),
  );
  act(() =>
    probe
      .read('Toggle', toggleSchema, 'Right to left editor-emoji-menu')
      .onCheckedChange(true),
  );
  expect(probe.read('App', appSchema).direction).toBe('rtl');
  act(() => probe.read('Button', buttonSchema, 'Reset editor-emoji-menu').onPress());
  expect(read().value).toEqual(initial);
});

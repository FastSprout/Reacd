import { act, render } from '@testing-library/react';
import type { EditorDocument } from '@fastsprout/reacd';
import { expect, it } from 'vitest';
import { editorSchema } from '../../src/schema/editor/editor.schema.js';
import { editorSuggestionMenuSchema } from
  '../../src/schema/editor-suggestion-menu/editor-suggestion-menu.schema.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { buttonComponentSchema as buttonSchema } from
  '../../src/schema/button/button.schema.js';
import { appSchema } from '../../src/schema/app/app.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { EditorSuggestionMenuExample } from './editor-suggestion-menu.js';

it(
  'reports native unavailability and preserves accepted document/menu metadata',
  () => {
  expectUnsupportedExample(<EditorSuggestionMenuExample />, 'Editor');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <EditorSuggestionMenuExample />
    </probe.Surface>,
  );
  const read = () => {
    const value = probe.read('Editor', editorSchema, 'Block suggestion document');
    if (!('onValueChange' in value)) throw new Error('Expected document callback');
    return value;
  };
  const initial = read().value;
  const menu = probe.read(
    'EditorSuggestionMenu',
    editorSuggestionMenuSchema,
    'Heading options',
  );
  expect(menu.items.map((item) => item.command)).toEqual(['paragraph', 'heading1']);
  const proposal: EditorDocument = {
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'intro',
        content: [{ type: 'text', text: 'Accepted proposal' }],
      },
    ],
  };
  act(() => read().onValueChange(proposal));
  expect(read().value).toEqual(proposal);
  act(() =>
    probe
      .read('Toggle', toggleSchema, 'Read-only editor-suggestion-menu')
      .onCheckedChange(true),
  );
  expect(read().readOnly).toBe(true);
  act(() =>
    probe
      .read('Toggle', toggleSchema, 'Read-only editor-suggestion-menu')
      .onCheckedChange(false),
  );
  act(() =>
    probe
      .read('Toggle', toggleSchema, 'Right to left editor-suggestion-menu')
      .onCheckedChange(true),
  );
  expect(probe.read('App', appSchema).direction).toBe('rtl');
  act(() =>
    probe.read('Button', buttonSchema, 'Reset editor-suggestion-menu').onPress(),
  );
  expect(read().value).toEqual(initial);
});

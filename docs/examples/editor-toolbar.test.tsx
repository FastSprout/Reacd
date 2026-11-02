import { act, render } from '@testing-library/react';
import type { EditorDocument } from '@fastsprout/reacd';
import { expect, it } from 'vitest';
import { editorSchema } from '../../src/schema/editor/editor.schema.js';
import { editorToolbarSchema } from
  '../../src/schema/editor-toolbar/editor-toolbar.schema.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { buttonComponentSchema as buttonSchema } from
  '../../src/schema/button/button.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { EditorToolbarExample } from './editor-toolbar.js';

it(
  'reports native unavailability and retains literal commands and accepted state',
  () => {
  expectUnsupportedExample(<EditorToolbarExample />, 'Editor');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <EditorToolbarExample />
    </probe.Surface>,
  );
  const read = () => {
    const value = probe.read('Editor', editorSchema, 'Review draft');
    if (!('onValueChange' in value)) throw new Error('Expected document callback');
    return value;
  };
  const initial = read().value;
  const toolbar = () =>
    probe.read('EditorToolbar', editorToolbarSchema, 'Review formatting');
  expect(toolbar().items?.map((item) => item.command)).toEqual([
    'bold',
    'italic',
    'heading2',
    'link',
    'removeLink',
    'undo',
    'redo',
  ]);
  expect(toolbar().items?.find((item) => item.command === 'link')).toMatchObject({
    href: 'https://reacd.dev/',
    label: 'Link to reacd',
  });
  const proposal: EditorDocument = {
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'review-intro',
        content: [{ type: 'text', text: 'Toolbar draft.', marks: ['bold'] }],
      },
    ],
  };
  act(() => read().onValueChange(proposal));
  expect(read().value).toEqual(proposal);
  act(() =>
    probe.read('Toggle', toggleSchema, 'Disable review toolbar').onCheckedChange(true),
  );
  expect(toolbar().disabled).toBe(true);
  act(() =>
    probe.read('Toggle', toggleSchema, 'Read-only review draft').onCheckedChange(true),
  );
  expect(read().readOnly).toBe(true);
  act(() => probe.read('Button', buttonSchema, 'Restore toolbar draft').onPress());
  expect(read().value).toEqual(initial);
});

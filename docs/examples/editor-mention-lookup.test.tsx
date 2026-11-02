import { act, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import type { EditorDocument } from '@fastsprout/reacd';
import { expect, it } from 'vitest';
import { editorSchema } from '../../src/schema/editor/editor.schema.js';
import { editorMentionMenuSchema } from
  '../../src/schema/editor-mention-menu/editor-mention-menu.schema.js';
import { editorMentionLookupRequestSchema } from
  '../../src/schema/editor-mention-menu/lookup.schema.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { buttonComponentSchema as buttonSchema } from
  '../../src/schema/button/button.schema.js';
import { appSchema } from '../../src/schema/app/app.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { EditorMentionLookupExample } from './editor-mention-lookup.js';

it(
  'reports native unavailability and retains correlated host replies and vetoes',
  () => {
  expectUnsupportedExample(<EditorMentionLookupExample />, 'Editor');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <EditorMentionLookupExample />
    </probe.Surface>,
  );
  const menu = () => {
    const value = probe.read(
      'EditorMentionMenu',
      editorMentionMenuSchema,
      'Remote directory options',
    );
    if (!('onQueryChange' in value)) throw new Error('Expected lookup callback');
    return value;
  };
  const editor = () => {
    const value = probe.read('Editor', editorSchema, 'Directory lookup document');
    if (!('onValueChange' in value)) throw new Error('Expected document callback');
    return value;
  };
  const initial = editor().value;
  const press = (label: string) =>
    act(() => probe.read('Button', buttonSchema, label).onPress());
  const request = (key: string, query: string) =>
    act(() =>
      menu().onQueryChange(editorMentionLookupRequestSchema.parse({ key, query })),
    );
  expect(menu().results).toBeNull();
  request('request-1', 'qq');
  expect(menu().results).toEqual({ key: 'request-1', query: 'qq', status: 'loading' });
  expect(probe.texts()).toContain('Lookup requests: 1');
  press('Clear response');
  expect(menu().results).toBeNull();
  press('Fail current');
  expect(menu().results).toMatchObject({
    status: 'error',
    error: 'Simulated lookup error.',
    key: 'request-1',
  });
  press('Empty current');
  expect(menu().results).toMatchObject({ status: 'ready', items: [] });
  press('Resolve current');
  const saved = menu().results;
  expect(saved).toMatchObject({
    key: 'request-1',
    status: 'ready',
    items: [{ id: 'directory-person', label: 'Directory entry request-1' }],
  });
  press('Save response for replay');
  request('request-2', 'rr');
  press('Resolve current');
  expect(menu().results).toMatchObject({ key: 'request-2' });
  press('Replay saved response');
  expect(menu().results).toEqual(saved);
  expect(probe.texts()).toEqual(
    expect.arrayContaining([
      'Lookup requests: 2',
      'Lookup key: request-2',
      'Lookup query: rr',
    ]),
  );
  request('request-3', 'qq');
  expect(menu().results).toMatchObject({ key: 'request-3', status: 'loading' });
  press('Replay saved response');
  expect(probe.texts()).toContain('Lookup key: request-3');
  press('Resolve current');
  expect(menu().results).toMatchObject({ key: 'request-3', status: 'ready' });
  const proposal: EditorDocument = {
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'directory-note',
        content: [
          {
            type: 'mention',
            id: 'directory-person',
            label: 'Directory entry request-3',
          },
        ],
      },
    ],
  };
  act(() => editor().onValueChange(proposal));
  expect(editor().value).toEqual(proposal);
  const toggle = (label: string) =>
    act(() => probe.read('Toggle', toggleSchema, label).onCheckedChange(true));
  toggle('Reject lookup edits');
  act(() => editor().onValueChange(initial));
  expect(editor().value).toEqual(proposal);
  toggle('Read-only lookup document');
  toggle('Disable lookup document');
  toggle('Right to left lookup');
  expect(editor()).toMatchObject({ readOnly: true, disabled: true });
  expect(probe.read('App', appSchema).direction).toBe('rtl');
  press('Reset lookup document');
  expect(editor()).toMatchObject({ value: initial, readOnly: false, disabled: false });
  expect(menu().results).toBeNull();
  expect(probe.texts()).toContain('Lookup requests: 0');
  expect(probe.read('App', appSchema).direction).toBe('ltr');
});

it(
  'hydrates headless declarations without requests and isolates provider sessions',
  () => {
  const first = exampleDeclarationProbe();
  const second = exampleDeclarationProbe();
  const tree = (
    <first.Surface>
      <EditorMentionLookupExample />
    </first.Surface>
  );
  const markup = renderToString(tree);
  expect(markup).toContain('Lookup requests: 0');
  const container = document.createElement('div');
  container.innerHTML = markup;
  document.body.append(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  const other = render(
    <second.Surface>
      <EditorMentionLookupExample />
    </second.Surface>,
  );
  try {
    expect(errors).toEqual([]);
    const menu = first.read(
      'EditorMentionMenu',
      editorMentionMenuSchema,
      'Remote directory options',
    );
    if (!('onQueryChange' in menu)) throw new Error('Expected lookup callback');
    act(() => menu.onQueryChange({ key: 'isolated', query: 'qq' }));
    expect(first.texts()).toContain('Lookup requests: 1');
    expect(second.texts()).toContain('Lookup requests: 0');
    expect(errors).toEqual([]);
  } finally {
    view.unmount();
    other.unmount();
    container.remove();
  }
});

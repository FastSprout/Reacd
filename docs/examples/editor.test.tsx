import { act, render } from '@testing-library/react';
import type { EditorDocument } from '@fastsprout/reacd';
import { expect, it } from 'vitest';
import { editorSchema } from '../../src/schema/editor/editor.schema.js';
import { toggleSchema } from '../../src/schema/toggle/toggle.schema.js';
import { buttonComponentSchema as buttonSchema } from
  '../../src/schema/button/button.schema.js';
import { appSchema } from '../../src/schema/app/app.schema.js';
import {
  exampleDeclarationProbe,
  expectUnsupportedExample,
} from '../../test-support/example-declaration-probe.js';
import { EditorExample } from './editor.js';

it(
  'reports native unavailability and preserves shared accepted/rejected documents',
  () => {
  expectUnsupportedExample(<EditorExample />, 'Editor');
  const probe = exampleDeclarationProbe();
  render(
    <probe.Surface>
      <EditorExample />
    </probe.Surface>,
  );
  const read = (label = 'Project notes') => {
    const value = probe.read('Editor', editorSchema, label);
    if (!('onValueChange' in value)) throw new Error('Expected document callback');
    return value;
  };
  const press = (label: string) =>
    act(() => probe.read('Button', buttonSchema, label).onPress());
  const toggle = (label: string) =>
    act(() => {
      const value = probe.read('Toggle', toggleSchema, label);
      value.onCheckedChange(!value.checked);
    });
  const initial = read().value;
  const proposal: EditorDocument = {
    version: 1,
    blocks: [
      {
        type: 'paragraph',
        id: 'accepted',
        content: [{ type: 'text', text: 'Accepted' }],
      },
    ],
  };
  expect(read('Notes reader').readOnly).toBe(true);
  act(() => read().onValueChange(proposal));
  expect(read('Notes reader').value).toEqual(proposal);
  expect(probe.texts()).toContain('Document edit requests: 1');
  press('Replace notes from host');
  const host = read().value;
  expect(host).not.toEqual(proposal);
  expect(read('Notes reader').value).toEqual(host);
  toggle('Reject note changes');
  act(() => read().onValueChange(proposal));
  expect(read().value).toEqual(host);
  expect(probe.texts()).toContain('Document edit requests: 2');
  toggle('Read-only notes');
  toggle('Disable notes');
  toggle('Right to left notes');
  expect(read()).toMatchObject({ readOnly: true, disabled: true });
  expect(probe.read('App', appSchema).direction).toBe('rtl');
  press('Restore notes document');
  expect(read().value).toEqual(initial);
  expect(read('Notes reader').value).toEqual(initial);
  expect(probe.texts()).toContain('Document edit requests: 0');
});

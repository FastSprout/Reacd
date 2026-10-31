import { userEvent } from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { createMenuEditor } from '../../../../test-support/editor-menu-fixture.js';
import { success } from '../../../../test-support/data-table.js';
import type { EditorMenuView } from '../../../renderer/editor/menu-context.js';
import { createEditorMenuPort } from './menu-port.js';

let restore: () => void = () => undefined;
const fixtures: ReturnType<typeof createMenuEditor>[] = [];
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => {
  for (const fixture of fixtures.splice(0)) fixture.dispose();
  restore();
});
async function dismissed() {
  const fixture = createMenuEditor();
  fixtures.push(fixture);
  let latest: EditorMenuView | undefined;
  const lease = success(
    createEditorMenuPort(fixture.instance, false).mount({
      kind: 'emoji',
      listId: 'recovery-options',
      items: () => [{ kind: 'emoji', name: 'wave', value: '👋', label: 'Wave' }],
      change: (view) => {
        latest = view;
      },
    }),
  );
  fixture.input.focus();
  fixture.instance.commands.insertContent(':missing');
  await waitFor(() => expect(latest?.items).toEqual([]));
  await userEvent.keyboard('{Escape}');
  expect(fixture.input).not.toHaveAttribute('aria-controls');
  expect(latest).toBeUndefined();
  return { ...fixture, lease, latest: () => latest };
}

it('reopens after a coalesced clear and new trigger', async () => {
  const fixture = await dismissed();
  const { instance, input } = fixture;
  instance.view.dispatch(
    instance.state.tr.insertText(':wa', 1, instance.state.doc.content.size - 1),
  );
  expect(instance.getText()).toBe(':wa');
  await waitFor(() =>
    expect(fixture.latest()?.items.map((item) => item.label)).toEqual(['Wave']),
  );
  expect(input).toHaveAttribute('aria-controls', 'recovery-options');
  fixture.lease.choose(0);
  expect(input.querySelector('[role="img"]')).toHaveAttribute('aria-label', 'wave');
});

it('recovers a DOM replacement that retains the old colon', async () => {
  const fixture = await dismissed();
  const paragraph = fixture.input.querySelector('p');
  if (paragraph === null) throw new Error('Expected the editable paragraph.');
  const steps: unknown[] = [];
  fixture.instance.on('transaction', ({ transaction }) => {
    for (const step of transaction.steps) steps.push(step.toJSON());
  });
  paragraph.textContent = ':wa';
  const selection = document.getSelection();
  if (selection === null) throw new Error('Expected browser selection.');
  const range = document.createRange();
  range.selectNodeContents(paragraph);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  await waitFor(() => expect(fixture.instance.getText()).toBe(':wa'));
  expect(steps).toContainEqual(expect.objectContaining({ from: 2, to: 9 }));
  await waitFor(() =>
    expect(fixture.latest()?.items.map((item) => item.label)).toEqual(['Wave']),
  );
});

it('keeps edits to an existing escaped token dismissed', async () => {
  const fixture = await dismissed();
  fixture.instance.commands.insertContent('x');
  await Promise.resolve();
  expect(fixture.instance.getText()).toBe(':missingx');
  expect(fixture.latest()).toBeUndefined();
  expect(fixture.input).not.toHaveAttribute('aria-controls');
});

it('keeps a partial replacement of the escaped query dismissed', async () => {
  const fixture = await dismissed();
  const instance = fixture.instance;
  instance.view.dispatch(instance.state.tr.insertText('w', 2, 3));
  await Promise.resolve();
  expect(instance.getText()).toBe(':wissing');
  expect(fixture.latest()).toBeUndefined();
  expect(fixture.input).not.toHaveAttribute('aria-controls');
});

it('keeps an escaped empty query dismissed after typing', async () => {
  const fixture = createMenuEditor();
  fixtures.push(fixture);
  let latest: EditorMenuView | undefined;
  success(
    createEditorMenuPort(fixture.instance, false).mount({
      kind: 'emoji',
      listId: 'empty-options',
      items: () => [{ kind: 'emoji', name: 'wave', value: '👋', label: 'Wave' }],
      change: (view) => {
        latest = view;
      },
    }),
  );
  fixture.input.focus();
  fixture.instance.commands.insertContent(':');
  await waitFor(() => expect(latest?.items).toHaveLength(1));
  await userEvent.keyboard('{Escape}');
  fixture.instance.commands.insertContent('w');
  await Promise.resolve();
  expect(fixture.instance.getText()).toBe(':w');
  expect(latest).toBeUndefined();
});

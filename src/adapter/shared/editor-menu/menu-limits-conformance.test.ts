import { userEvent } from '@testing-library/user-event';
import { waitFor } from '../../../../test-support/adapter-testing.js';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createMenuEditor } from '../../../../test-support/editor-menu-fixture.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { success } from '../../../../test-support/data-table.js';
import { EDITOR_MENU_POLICY } from '../../../core/editor-menu-policy.js';
import type { EditorMenuView } from '../../../renderer/editor/menu-context.js';
import { createEditorMenuPort } from './menu-port.js';

const fixtures: ReturnType<typeof createMenuEditor>[] = [];
let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => {
  for (const fixture of fixtures.splice(0)) fixture.dispose();
  restore();
});
function fixture(kind: 'paragraph' | 'codeBlock' = 'paragraph') {
  const next = createMenuEditor(kind);
  fixtures.push(next);
  return next;
}

it('keeps disabled choices unselectable during keyboard and IME', async () => {
  const user = userEvent.setup();
  const { instance, input } = fixture();
  const before = new Set(instance.state.plugins);
  const views: (EditorMenuView | undefined)[] = [];
  const lease = success(
    createEditorMenuPort(instance, false).mount({
      kind: 'mention',
      listId: 'people',
      change: (view) => views.push(view),
      items: () => [
        { kind: 'mention', id: 'blocked', label: 'Blocked', disabled: true },
      ],
    }),
  );
  input.focus();
  await user.keyboard('@');
  await waitFor(() => expect(views.at(-1)?.selected).toBe(-1));
  expect(input).not.toHaveAttribute('aria-activedescendant');
  await user.keyboard('{ArrowDown}{ArrowUp}{Enter}');
  lease.choose(0);
  lease.choose(99);
  expect(instance.getText()).toBe('@');
  const plugin = instance.state.plugins.find((entry) => !before.has(entry));
  const handler = plugin?.props.handleKeyDown;
  if (plugin === undefined || handler === undefined)
    throw new Error('Expected plugin.');
  expect(
    handler.call(
      plugin,
      instance.view,
      new KeyboardEvent('keydown', { key: 'Enter', isComposing: true }),
    ),
  ).toBe(false);
  expect(
    handler.call(plugin, instance.view, new KeyboardEvent('keydown', { key: 'Tab' })),
  ).toBe(false);
  expect(instance.getText()).toBe('@');
  lease.destroy();
});

it('stops suggestions at the query budget and inside code blocks', async () => {
  const { instance, input } = fixture();
  const events: (EditorMenuView | undefined)[] = [];
  const label = 'x'.repeat(EDITOR_MENU_POLICY.maxQuery + 1);
  const lease = success(
    createEditorMenuPort(instance, false).mount({
      kind: 'mention',
      listId: 'people',
      items: () => [{ kind: 'mention', id: 'long', label }],
      change: (view) => events.push(view),
    }),
  );
  input.focus();
  instance.commands.insertContent(`@${'x'.repeat(EDITOR_MENU_POLICY.maxQuery)}`);
  await waitFor(() =>
    expect(events.at(-1)?.query.length).toBe(EDITOR_MENU_POLICY.maxQuery),
  );
  instance.commands.insertContent('x');
  await waitFor(() => expect(events.at(-1)).toBeUndefined());
  expect(input).not.toHaveAttribute('aria-controls');
  lease.destroy();
  const code = fixture('codeBlock');
  const change = vi.fn();
  const codeLease = success(
    createEditorMenuPort(code.instance, false).mount({
      kind: 'mention',
      listId: 'code-people',
      change,
      items: () => [{ kind: 'mention', id: 'person', label: 'Person' }],
    }),
  );
  code.input.focus();
  code.instance.commands.insertContent('@');
  await Promise.resolve();
  await Promise.resolve();
  expect(change).not.toHaveBeenCalled();
  expect(code.input).not.toHaveAttribute('aria-controls');
  codeLease.destroy();
});

it('marks unsafe command capabilities unavailable before choosing', async () => {
  const user = userEvent.setup();
  const { instance, input } = fixture();
  const events: (EditorMenuView | undefined)[] = [];
  const lease = success(
    createEditorMenuPort(instance, false).mount({
      kind: 'suggestion',
      listId: 'commands',
      change: (view) => events.push(view),
      items: () => [
        {
          kind: 'suggestion',
          label: 'Unsafe link',
          value: { command: 'link', href: 'javascript:alert(1)' },
        },
      ],
    }),
  );
  input.focus();
  await user.keyboard('/');
  await waitFor(() => expect(events.at(-1)?.items[0]?.disabled).toBe(true));
  lease.choose(0);
  expect(instance.getText()).toBe('/');
  expect(instance.isActive('link')).toBe(false);
  lease.destroy();
});

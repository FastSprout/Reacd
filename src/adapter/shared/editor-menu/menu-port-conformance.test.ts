import { userEvent } from '@testing-library/user-event';
import { waitFor } from '../../../../test-support/adapter-testing.js';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { createMenuEditor } from '../../../../test-support/editor-menu-fixture.js';
import { success } from '../../../../test-support/data-table.js';
import type {
  EditorMenuItem,
  EditorMenuLease,
  EditorMenuView,
} from '../../../renderer/editor/menu-context.js';
import { EDITOR_MENU_POLICY } from '../../../core/editor-menu-policy.js';
import { editorDocumentFromSdk } from '../editor-conversion/from-sdk.js';
import { createEditorMenuPort } from './menu-port.js';

const fixtures: ReturnType<typeof createMenuEditor>[] = [];
let restore: () => void = () => undefined;
let restoreScroll: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
  const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
  restoreScroll = () => scroll.mockRestore();
});
afterEach(() => {
  for (const fixture of fixtures.splice(0)) fixture.dispose();
  restore();
  restoreScroll();
});
function fixture() {
  const next = createMenuEditor();
  fixtures.push(next);
  return next;
}
const PERSON: EditorMenuItem = { kind: 'mention', id: 'person', label: 'Person' };

it('rejects missing, protected, duplicate and destroyed registrations', () => {
  const { instance } = fixture();
  const request = {
    kind: 'mention',
    listId: 'people',
    items: () => [PERSON],
    change: vi.fn(),
  } as const;
  const absent = createEditorMenuPort(null, false);
  expect(absent.disabled).toBe(true);
  expect(absent.mount(request).success).toBe(false);
  const disabled = createEditorMenuPort(instance, true);
  expect(disabled.disabled).toBe(true);
  expect(disabled.mount(request).success).toBe(false);
  const port = createEditorMenuPort(instance, false);
  const lease = success(port.mount(request));
  const duplicate = port.mount(request);
  expect(duplicate.success).toBe(false);
  if (duplicate.success) throw new Error('Expected duplicate failure.');
  expect(duplicate.issues[0]?.message).toBe(EDITOR_MENU_POLICY.duplicateError);
  lease.destroy();
  success(port.mount(request)).destroy();
  instance.destroy();
  expect(port.mount(request).success).toBe(false);
});

it('refreshes catalogs and ignores inactive choices', async () => {
  const user = userEvent.setup();
  const { instance, input } = fixture();
  let catalog: readonly EditorMenuItem[] = [PERSON];
  const events: (EditorMenuView | undefined)[] = [];
  const lease = success(
    createEditorMenuPort(instance, false).mount({
      kind: 'mention',
      listId: 'people',
      items: () => catalog,
      change: (view) => events.push(view),
    }),
  );
  lease.choose(0);
  lease.refresh();
  lease.close();
  expect(instance.getText()).toBe('');
  input.focus();
  await user.keyboard('@');
  await waitFor(() => expect(events.at(-1)?.items).toEqual([PERSON]));
  catalog = [{ kind: 'mention', id: 'replacement', label: 'Replacement' }];
  lease.refresh();
  expect(events.at(-1)?.items).toEqual(catalog);
  instance.setEditable(false);
  lease.choose(0);
  expect(instance.getText()).toBe('@');
  instance.setEditable(true);
  lease.choose(0);
  expect(success(editorDocumentFromSdk(instance.state.doc)).blocks).toEqual([
    {
      type: 'paragraph',
      id: 'fixture',
      content: [
        { type: 'mention', id: 'replacement', label: 'Replacement' },
        { type: 'text', text: ' ' },
      ],
    },
  ]);
  lease.choose(0);
  lease.destroy();
  lease.destroy();
  lease.close();
  lease.refresh();
  lease.choose(0);
  expect(input).not.toHaveAttribute('aria-controls');
});

it('preserves another trigger ARIA owner after lease release', async () => {
  const user = userEvent.setup();
  const { instance, input } = fixture();
  const port = createEditorMenuPort(instance, false);
  const mention = success(
    port.mount({
      kind: 'mention',
      listId: 'people',
      items: () => [PERSON],
      change: vi.fn(),
    }),
  );
  const emoji = success(
    port.mount({
      kind: 'emoji',
      listId: 'emoji',
      items: () => [{ kind: 'emoji', name: 'wave', value: '👋', label: 'Wave' }],
      change: vi.fn(),
    }),
  );
  input.focus();
  await user.keyboard('@');
  await waitFor(() => expect(input).toHaveAttribute('aria-controls', 'people'));
  await user.keyboard('{Escape} :');
  await waitFor(() => expect(input).toHaveAttribute('aria-controls', 'emoji'));
  mention.destroy();
  await waitFor(() => expect(input).toHaveAttribute('aria-controls', 'emoji'));
  emoji.choose(0);
  expect(instance.getText()).toContain('👋');
  emoji.destroy();
});

it('drops queued SDK notifications after teardown', async () => {
  const { instance, input } = fixture();
  const change = vi.fn();
  const lease = success(
    createEditorMenuPort(instance, false).mount({
      kind: 'mention',
      listId: 'people',
      items: () => [PERSON],
      change,
    }),
  );
  input.focus();
  instance.commands.insertContent('@');
  lease.destroy();
  const before = change.mock.calls.length;
  await Promise.resolve();
  await Promise.resolve();
  expect(change).toHaveBeenCalledTimes(before);
  const second = success(
    createEditorMenuPort(instance, false).mount({
      kind: 'mention',
      listId: 'second',
      items: () => [PERSON],
      change,
    }),
  );
  instance.destroy();
  second.choose(0);
  second.close();
  second.refresh();
  second.destroy();
});

it('does not resurrect a synchronously closed query', async () => {
  const user = userEvent.setup();
  const { instance, input } = fixture();
  let lease: EditorMenuLease | undefined;
  let closeOnLookup = false;
  const change = vi.fn();
  lease = success(
    createEditorMenuPort(instance, false).mount({
      kind: 'mention',
      listId: 'people',
      items: () => [],
      change,
      lookup: () => {
        if (closeOnLookup) {
          closeOnLookup = false;
          lease?.close();
        }
        return { status: 'ready', error: undefined, items: [PERSON] };
      },
    }),
  );
  input.focus();
  await user.keyboard('@');
  await waitFor(() => expect(input).toHaveAttribute('aria-controls', 'people'));
  closeOnLookup = true;
  lease.refresh();
  await waitFor(() => expect(input).not.toHaveAttribute('aria-controls'));
  expect(change.mock.lastCall?.[0]).toBeUndefined();
  lease.destroy();
});

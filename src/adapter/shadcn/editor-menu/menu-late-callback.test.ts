import { Suggestion } from '@tiptap/suggestion';
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { userEvent } from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createMenuEditor } from '../../../../test-support/editor-menu-fixture.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { success } from '../../../../test-support/data-table.js';
import type { EditorMenuItem } from '../../../renderer/editor/menu-context.js';
import { createEditorMenuPort } from './menu-port.js';

vi.mock('@tiptap/suggestion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tiptap/suggestion')>();
  return { ...actual, Suggestion: vi.fn(actual.Suggestion) };
});

type NativeProps = SuggestionProps<EditorMenuItem, EditorMenuItem>;
type NativeRender = NonNullable<
  SuggestionOptions<EditorMenuItem, EditorMenuItem>['render']
>;
const fixtures: ReturnType<typeof createMenuEditor>[] = [];
let captured: NativeProps | undefined;
let retained: ReturnType<NativeRender> | undefined;
let restore: () => void = () => undefined;

beforeEach(async () => {
  restore = installEditorGeometry();
  captured = undefined;
  retained = undefined;
  const actual =
    await vi.importActual<typeof import('@tiptap/suggestion')>('@tiptap/suggestion');
  vi.mocked(Suggestion<EditorMenuItem, EditorMenuItem>).mockImplementation(
    (options) => {
      const render = options.render;
      if (render === undefined) throw new Error('Expected a native menu renderer.');
      return actual.Suggestion<EditorMenuItem, EditorMenuItem>({
        ...options,
        render: () => {
          const callbacks = render();
          retained = callbacks;
          return {
            ...callbacks,
            onStart(next) {
              captured = next;
              callbacks.onStart?.(next);
            },
            onUpdate(next) {
              captured = next;
              callbacks.onUpdate?.(next);
            },
          };
        },
      });
    },
  );
});
afterEach(() => {
  for (const fixture of fixtures.splice(0)) fixture.dispose();
  restore();
  vi.mocked(Suggestion<EditorMenuItem, EditorMenuItem>).mockReset();
});

it.each(['lease', 'editor'] as const)(
  'ignores genuine retained SDK callbacks after %s teardown',
  async (owner) => {
    const user = userEvent.setup();
    const fixture = createMenuEditor();
    fixtures.push(fixture);
    const { instance, input } = fixture;
    const items = vi.fn(() => [
      { kind: 'mention', id: 'person', label: 'Person' } as const,
    ]);
    const change = vi.fn();
    const lease = success(
      createEditorMenuPort(instance, false).mount({
        kind: 'mention',
        listId: 'people',
        items,
        change,
      }),
    );
    input.focus();
    await user.keyboard('@');
    await waitFor(() => expect(captured?.query).toBe(''));
    const payload = captured;
    const callbacks = retained;
    if (payload === undefined || callbacks === undefined)
      throw new Error('Expected real SDK renderer callbacks and payload.');
    expect(input).toHaveAttribute('aria-controls', 'people');
    const nativeView = instance.view;
    if (owner === 'lease') lease.destroy();
    else instance.destroy();
    const markup = input.outerHTML;
    const lookupCount = items.mock.calls.length;
    const changeCount = change.mock.calls.length;
    callbacks.onStart?.(payload);
    callbacks.onUpdate?.(payload);
    expect(items).toHaveBeenCalledTimes(lookupCount);
    expect(change).toHaveBeenCalledTimes(changeCount);
    expect(input.outerHTML).toBe(markup);
    for (const key of ['ArrowDown', 'ArrowUp', 'Enter']) {
      expect(
        callbacks.onKeyDown?.({
          view: nativeView,
          range: payload.range,
          event: new KeyboardEvent('keydown', { key }),
        }),
      ).toBe(false);
    }
    expect(items).toHaveBeenCalledTimes(lookupCount);
    expect(change).toHaveBeenCalledTimes(changeCount);
    expect(input.outerHTML).toBe(markup);
    lease.destroy();
  },
);

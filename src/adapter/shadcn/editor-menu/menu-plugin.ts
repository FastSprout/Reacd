import type { Editor, Range } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import { z } from 'zod';
import { Suggestion, exitSuggestion } from '@tiptap/suggestion';
import type { SuggestionProps } from '@tiptap/suggestion';
import { EDITOR_MENU_POLICY as P } from
  '@fastsprout/reacd/adapter-runtime/core/editor-menu-policy.js';
import type {
  EditorMenuItem,
  EditorMenuLease,
  EditorMenuLookupState,
  EditorMenuRequest,
} from '@fastsprout/reacd/adapter-runtime/renderer/editor/menu-context.js';
import { editorCommandChain } from '../editor-sdk/command-chain.js';
import { canRunSdkCommand } from '../editor-sdk/commands.js';

type NativeSuggestion = SuggestionProps<EditorMenuItem, EditorMenuItem>;
const activeSuggestionSchema = z.object({ active: z.literal(true) });

function insert(editor: Editor, range: Range, item: EditorMenuItem) {
  const chain = editor.chain().focus().deleteRange(range);
  if (item.kind === 'suggestion') return editorCommandChain(chain, item.value).run();
  const atom =
    item.kind === 'mention'
      ? { type: 'reacdMention', attrs: { id: item.id, label: item.label } }
      : { type: 'reacdEmoji', attrs: { name: item.name, value: item.value } };
  return chain.insertContent([atom, { type: 'text', text: P.suffix }]).run();
}

export function mountEditorMenu(
  editor: Editor,
  request: EditorMenuRequest,
  released: () => void,
): EditorMenuLease {
  const key = new PluginKey<unknown>(`reacd-${request.kind}`);
  let current: NativeSuggestion | undefined;
  let selected: number = P.initialIndex;
  let destroyed = false;
  let revision = 0;
  function resolved(query: string): EditorMenuLookupState {
    const remote = request.lookup?.(query);
    const items =
      remote?.items ??
      request
        .items()
        .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, P.maxResults);
    return {
      status: remote?.status ?? 'ready',
      error: remote?.error,
      items: items
        .slice(0, P.maxResults)
        .map((item) =>
          item.kind === 'suggestion' && !canRunSdkCommand(editor, item.value)
            ? { ...item, disabled: true }
            : item,
        ),
    };
  }

  function clear() {
    revision += 1;
    current = undefined;
    if (
      !editor.isDestroyed &&
      editor.view.dom.getAttribute('aria-controls') === request.listId
    ) {
      for (const name of [
        'aria-controls',
        'aria-expanded',
        'aria-activedescendant',
        'aria-autocomplete',
        'aria-busy',
      ])
        editor.view.dom.removeAttribute(name);
    }
    request.change(undefined);
  }
  function publish(next: NativeSuggestion) {
    if (destroyed || editor.isDestroyed) return;
    const ticket = ++revision;
    current = next;
    const data = resolved(next.query);
    if (ticket !== revision || destroyed || editor.isDestroyed) return;
    current = { ...next, items: [...data.items] };
    if (data.items[selected] === undefined || data.items[selected]?.disabled === true)
      selected = data.items.findIndex((item) => item.disabled !== true);
    const input = editor.view.dom;
    input.setAttribute('aria-controls', request.listId);
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-busy', String(data.status === 'loading'));
    if (data.items[selected] === undefined)
      input.removeAttribute('aria-activedescendant');
    else input.setAttribute('aria-activedescendant', `${request.listId}-${selected}`);
    request.change(
      Object.freeze({
        query: next.query,
        status: data.status,
        error: data.error,
        items: Object.freeze([...data.items]),
        selected,
      }),
    );
  }

  function close() {
    if (!destroyed && !editor.isDestroyed) exitSuggestion(editor.view, key);
  }
  function choose(index: number) {
    const suggestion = current;
    if (
      destroyed ||
      editor.isDestroyed ||
      !editor.isEditable ||
      suggestion === undefined
    )
      return;
    const item = suggestion.items[index];
    if (item === undefined || item.disabled === true) return;
    suggestion.command(item);
    close();
  }
  function step(suggestion: NativeSuggestion, direction: 1 | -1) {
    const enabled = suggestion.items.flatMap((item, index) =>
      item.disabled === true ? [] : [index],
    );
    if (enabled.length > 0) {
      const next =
        (enabled.indexOf(selected) + direction + enabled.length) % enabled.length;
      for (const [position, value] of enabled.entries()) {
        if (position === next) selected = value;
      }
    }
    publish(suggestion);
  }
  const plugin = Suggestion<EditorMenuItem, EditorMenuItem>({
    editor,
    pluginKey: key,
    char: P.triggers[request.kind],
    allow: ({ state, range }) =>
      editor.isEditable &&
      range.to - range.from <= P.maxQuery + P.triggers[request.kind].length &&
      state.selection.$from.parent.type.name !== 'codeBlock',
    items: ({ query }) => [...resolved(query).items],
    command: ({ editor: active, range, props }) => {
      insert(active, range, props);
    },
    render: () => ({
      onStart: (next) => {
        selected = P.initialIndex;
        publish(next);
      },
      onUpdate: (next) => {
        if (current?.query !== next.query) selected = P.initialIndex;
        publish(next);
      },
      onExit: () => {
        if (destroyed) return;
        if (
          editor.isDestroyed ||
          !activeSuggestionSchema.safeParse(key.getState(editor.state)).success
        )
          clear();
      },
      onKeyDown: ({ event }) => {
        const suggestion = current;
        if (editor.isDestroyed || suggestion === undefined || event.isComposing)
          return false;
        if (event.key === 'ArrowDown') {
          step(suggestion, 1);
          return true;
        }
        if (event.key === 'ArrowUp') {
          step(suggestion, -1);
          return true;
        }
        if (event.key === 'Enter') {
          choose(selected);
          return true;
        }
        return false;
      },
    }),
  });
  editor.registerPlugin(plugin, (registered, plugins) => [registered, ...plugins]);
  return {
    choose,
    close,
    refresh() {
      if (current !== undefined && !destroyed && !editor.isDestroyed) publish(current);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      clear();
      if (!editor.isDestroyed) {
        editor.unregisterPlugin(key);
      }
      released();
    },
  };
}

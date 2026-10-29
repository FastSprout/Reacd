import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { installEditorGeometry } from '../../../test-support/editor-geometry.js';
import { success } from '../../../test-support/data-table.js';
import { selectEditorText } from '../../../test-support/editor-selection.js';
import { editorDocumentSchema } from '../../schema/editor/document/index.js';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';

const INITIAL = {
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      id: 'intro',
      content: [{ type: 'text', text: 'Initial draft' }],
    },
  ],
};
const HOST = {
  version: 1,
  blocks: [
    {
      type: 'paragraph',
      id: 'host-note',
      content: [{ type: 'text', text: 'Host replacement.' }],
    },
  ],
};
const DEFINITIONS = [
  { key: 'notes', kind: 'richDocument', access: 'readWrite', initial: INITIAL },
];
let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => restore());

function editor(
  label: string,
  mode: 'read' | 'readWrite' = 'readWrite',
  flags: { readOnly?: boolean; disabled?: boolean } = {},
) {
  return {
    type: 'Editor',
    label,
    ...flags,
    value: { state: 'notes', mode },
    toolbar: [
      {
        type: 'EditorToolbar',
        label: `${label} formatting`,
        items: [{ command: 'bold' }, { command: 'undo' }],
      },
    ],
    children: [{ type: 'Text', content: `${label} help` }],
  };
}
function model(
  children: readonly unknown[] = [editor('Writer'), editor('Reader', 'read')],
) {
  return {
    schemaVersion: '0.2',
    state: DEFINITIONS,
    root: { type: 'VStack', children },
  };
}
it('shares native edits, formatting and quiet host replacement', async () => {
  const user = userEvent.setup();
  const first = success(createStateRegistry(DEFINITIONS));
  const other = success(createStateRegistry(DEFINITIONS));
  const notify = vi.fn();
  const unsubscribe = success(first.subscribe('notes', notify));
  const view = render(<GenerativeUI document={model()} registry={first} />);
  try {
    const writer = await screen.findByRole('textbox', { name: 'Writer' });
    const reader = await screen.findByRole('textbox', { name: 'Reader' });
    expect(writer.textContent).toBe('Initial draft');
    expect(reader.textContent).toBe('Initial draft');
    expect(notify).not.toHaveBeenCalled();
    expect(screen.getByText('Writer help')).toBeVisible();
    expect(reader).toHaveAttribute('aria-readonly', 'true');
    act(() => selectEditorText(writer));
    await user.keyboard('!');
    await waitFor(() => expect(reader.textContent).toBe('Initial draft!'));
    expect(notify).toHaveBeenCalledTimes(1);
    act(() => selectEditorText(writer, 'all'));
    const toolbar = screen.getByRole('toolbar', { name: 'Writer formatting' });
    await user.click(within(toolbar).getByRole('button', { name: 'Bold' }));
    await waitFor(() =>
      expect(reader.querySelector('strong')?.textContent).toBe('Initial draft!'),
    );
    expect(notify).toHaveBeenCalledTimes(2);
    act(() => {
      expect(first.update('notes', HOST).success).toBe(true);
    });
    await waitFor(() => expect(writer.textContent).toBe('Host replacement.'));
    expect(reader.textContent).toBe('Host replacement.');
    expect(notify).toHaveBeenCalledTimes(3);
    expect(success(other.read('notes')).value).toEqual(INITIAL);
    expect(first.update('notes', '<p>Unsafe</p>').success).toBe(false);
    expect(notify).toHaveBeenCalledTimes(3);
  } finally {
    view.unmount();
    unsubscribe();
  }
});

it('protects readonly, disabled and read bindings', async () => {
  const state = success(createStateRegistry(DEFINITIONS));
  const notify = vi.fn();
  const unsubscribe = success(state.subscribe('notes', notify));
  const view = render(
    <GenerativeUI
      document={model([
        editor('Literal reader', 'readWrite', { readOnly: true }),
        editor('Disabled', 'readWrite', { disabled: true }),
        editor('Binding reader', 'read', { readOnly: false }),
      ])}
      registry={state}
    />,
  );
  try {
    for (const label of ['Literal reader', 'Disabled', 'Binding reader']) {
      const box = await screen.findByRole('textbox', { name: label });
      expect(box).toHaveAttribute('contenteditable', 'false');
      const toolbar = screen.getByRole('toolbar', { name: `${label} formatting` });
      for (const button of within(toolbar).getAllByRole('button'))
        expect(button).toBeDisabled();
      fireEvent.paste(box, { clipboardData: { getData: () => 'Unwanted' } });
      expect(box.textContent).toBe('Initial draft');
    }
    expect(notify).not.toHaveBeenCalled();
    act(() => {
      expect(state.update('notes', HOST).success).toBe(true);
    });
    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: 'Disabled' }).textContent).toBe(
        'Host replacement.',
      ),
    );
    expect(notify).toHaveBeenCalledTimes(1);
  } finally {
    view.unmount();
    unsubscribe();
  }
});

it('hydrates isolated documents before publishing native edits', async () => {
  const user = userEvent.setup();
  const server = success(createStateRegistry(DEFINITIONS));
  const client = success(createStateRegistry(DEFINITIONS));
  const serverNotify = vi.fn();
  const clientNotify = vi.fn();
  const stopServer = success(server.subscribe('notes', serverNotify));
  const stopClient = success(client.subscribe('notes', clientNotify));
  const documentModel = model();
  const markup = renderToString(
    <GenerativeUI document={documentModel} registry={server} />,
  );
  expect(markup).toContain('Writer preview');
  expect(markup).toContain('Initial draft');
  expect(markup).not.toContain('contenteditable="true"');
  const container = document.createElement('div');
  container.innerHTML = markup;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(<GenerativeUI document={documentModel} registry={client} />, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  try {
    const writer = await screen.findByRole('textbox', { name: 'Writer' });
    await screen.findByRole('textbox', { name: 'Reader' });
    expect(serverNotify).not.toHaveBeenCalled();
    expect(clientNotify).not.toHaveBeenCalled();
    expect(errors).toEqual([]);
    act(() => selectEditorText(writer));
    await user.keyboard('?');
    await waitFor(() => expect(clientNotify).toHaveBeenCalledTimes(1));
    expect(success(server.read('notes')).value).toEqual(INITIAL);
    expect(serverNotify).not.toHaveBeenCalled();
    expect(errors).toEqual([]);
  } finally {
    view.unmount();
    container.remove();
    stopServer();
    stopClient();
  }
});

it('dispatches three native menu kinds into valid document nodes', async () => {
  const user = userEvent.setup();
  const state = success(createStateRegistry(DEFINITIONS));
  const declaration = editor('Menus');
  render(
    <GenerativeUI
      registry={state}
      document={model([
        {
          ...declaration,
          children: [
            {
              type: 'EditorSuggestionMenu',
              label: 'Blocks',
              items: [{ command: 'heading2', label: 'Heading 2' }],
            },
            {
              type: 'EditorMentionMenu',
              label: 'People',
              items: [{ id: 'person', label: 'Example person' }],
            },
            {
              type: 'EditorEmojiMenu',
              label: 'Emoji',
              items: [{ name: 'wave', value: '👋', label: 'Wave' }],
            },
          ],
        },
      ])}
    />,
  );
  const box = await screen.findByRole('textbox', { name: 'Menus' });
  const cases = [
    { trigger: ' /', label: 'Heading 2', kind: 'heading' },
    {
      trigger: ' @',
      label: 'Example person',
      kind: 'mention',
      node: { type: 'mention', id: 'person', label: 'Example person' },
    },
    {
      trigger: ' :',
      label: 'Wave',
      kind: 'emoji',
      node: { type: 'emoji', name: 'wave', value: '👋' },
    },
  ] as const;
  for (const item of cases) {
    act(() => {
      expect(state.update('notes', INITIAL).success).toBe(true);
    });
    await waitFor(() => expect(box.textContent).toBe('Initial draft'));
    act(() => selectEditorText(box));
    await user.keyboard(item.trigger);
    await user.click(await screen.findByRole('option', { name: item.label }));
    const document = editorDocumentSchema.parse(success(state.read('notes')).value);
    if (item.kind === 'heading')
      expect(
        document.blocks.some((block) => block.type === 'heading' && block.level === 2),
      ).toBe(true);
    else {
      const content = document.blocks.flatMap((block) =>
        'content' in block ? block.content : [],
      );
      expect(content).toContainEqual(item.node);
    }
  }
});

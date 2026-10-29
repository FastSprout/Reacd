import { StrictMode, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type {
  EditorMentionLookupRequest,
  EditorMentionLookupResult,
} from '../../../schema/editor-mention-menu/lookup.schema.js';
import { installEditorGeometry } from '../../../../test-support/editor-geometry.js';
import { editorDocumentSchema } from '../../../schema/editor/document/index.js';
import { ShadcnEditor } from '../editor/editor.adapter.js';
import {
  ShadcnEditorMentionMenu,
} from '../editor-mention-menu/editor-mention-menu.adapter.js';

let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
});
afterEach(() => restore());
interface HostProps {
  results: EditorMentionLookupResult | null;
  query: (request: EditorMentionLookupRequest) => void;
  disabled?: boolean;
}
function Host({ results, query, disabled }: HostProps) {
  const [value, setValue] = useState(() =>
    editorDocumentSchema.parse({
      version: 1,
      blocks: [{ type: 'paragraph', id: 'intro', content: [] }],
    }),
  );
  return (
    <ShadcnEditor label="Remote document" value={value} onValueChange={setValue}>
      <ShadcnEditorMentionMenu
        label="People"
        results={results}
        onQueryChange={query}
        {...(disabled === undefined ? {} : { disabled })}
      />
    </ShadcnEditor>
  );
}

it('correlates A/B/A responses and retains accepted current results', async () => {
  const requests: EditorMentionLookupRequest[] = [];
  const query = (request: EditorMentionLookupRequest) => {
    requests.push(request);
  };
  const view = render(
    <StrictMode>
      <Host results={null} query={query} />
    </StrictMode>,
  );
  const box = await screen.findByRole('textbox', { name: 'Remote document' });
  expect(requests).toHaveLength(0);
  box.focus();
  await userEvent.keyboard('@a');
  const first = requests.at(-1);
  if (first === undefined) throw new Error('Expected first lookup request.');
  expect(first.query).toBe('a');
  expect(Object.isFrozen(first)).toBe(true);
  await userEvent.keyboard('{Control>}a{/Control}');
  await userEvent.keyboard('@b');
  const second = requests.at(-1);
  if (second === undefined) throw new Error('Expected second lookup request.');
  expect(second.query).toBe('b');
  view.rerender(
    <StrictMode>
      <Host
        query={query}
        results={{
          ...first,
          status: 'ready',
          items: [{ id: 'old', label: 'Old result' }],
        }}
      />
    </StrictMode>,
  );
  expect(screen.queryByRole('option', { name: 'Old result' })).toBeNull();
  expect(await screen.findByText('Loading results.')).toBeVisible();
  view.rerender(
    <StrictMode>
      <Host
        query={query}
        results={{
          ...second,
          status: 'ready',
          items: [{ id: 'current', label: 'Authoritative fuzzy match' }],
        }}
      />
    </StrictMode>,
  );
  expect(
    await screen.findByRole('option', { name: 'Authoritative fuzzy match' }),
  ).toBeVisible();
  view.rerender(
    <StrictMode>
      <Host
        query={query}
        results={{
          ...first,
          status: 'ready',
          items: [{ id: 'old', label: 'Old result' }],
        }}
      />
    </StrictMode>,
  );
  expect(
    screen.getByRole('option', { name: 'Authoritative fuzzy match' }),
  ).toBeVisible();
  await userEvent.keyboard('{Control>}a{/Control}');
  await userEvent.keyboard('@a');
  const third = requests.at(-1);
  if (third === undefined) throw new Error('Expected third lookup request.');
  expect(third.query).toBe('a');
  expect(third.key).not.toBe(first.key);
  view.rerender(
    <StrictMode>
      <Host
        query={query}
        results={{
          ...first,
          status: 'ready',
          items: [{ id: 'old', label: 'Old result' }],
        }}
      />
    </StrictMode>,
  );
  expect(screen.queryByRole('option', { name: 'Old result' })).toBeNull();
  expect(
    screen.queryByRole('option', { name: 'Authoritative fuzzy match' }),
  ).toBeNull();
  view.rerender(
    <StrictMode>
      <Host
        query={query}
        results={{
          ...third,
          status: 'ready',
          items: [{ id: 'newest', label: 'Newest result' }],
        }}
      />
    </StrictMode>,
  );
  await userEvent.click(await screen.findByRole('option', { name: 'Newest result' }));
  await waitFor(() => expect(box.textContent).toBe('@Newest result '));
});

it('shows lookup states without duplicate or disabled requests', async () => {
  const requests: EditorMentionLookupRequest[] = [];
  const query = vi.fn((request: EditorMentionLookupRequest) => {
    requests.push(request);
  });
  const view = render(<Host results={null} query={query} disabled />);
  const box = await screen.findByRole('textbox', { name: 'Remote document' });
  box.focus();
  await userEvent.keyboard('@a');
  expect(query).not.toHaveBeenCalled();
  await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
  view.rerender(<Host results={null} query={query} />);
  await userEvent.keyboard('@a');
  expect(requests.map((request) => request.query)).toEqual(['', 'a']);
  const current = requests.at(-1);
  if (current === undefined) throw new Error('Expected lookup request.');
  view.rerender(
    <Host
      query={query}
      results={{ ...current, status: 'error', error: 'Lookup unavailable.' }}
    />,
  );
  expect(await screen.findByRole('alert')).toHaveTextContent('Lookup unavailable.');
  const count = requests.length;
  view.rerender(
    <Host query={query} results={{ ...current, status: 'ready', items: [] }} />,
  );
  expect(await screen.findByText('No matching results.')).toBeVisible();
  expect(requests).toHaveLength(count);
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('listbox', { name: 'People' })).toBeNull();
});

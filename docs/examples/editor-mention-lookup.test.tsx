import { act, render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { installEditorGeometry } from '../../test-support/editor-geometry.js';
import { selectEditorText } from '../../test-support/editor-selection.js';
import { EditorMentionLookupExample } from './editor-mention-lookup.js';

let restore: () => void = () => undefined;
beforeEach(() => {
  restore = installEditorGeometry();
  vi.spyOn(window, 'scrollBy').mockImplementation(() => undefined);
});
afterEach(() => {
  restore();
  vi.restoreAllMocks();
});
async function press(label: string) {
  await userEvent.click(screen.getByRole('button', { name: label }));
}
function requestKey() {
  const text = screen.getByText(/^Lookup key: /).textContent;
  if (text === null) throw new Error('Expected current lookup key.');
  return text.slice('Lookup key: '.length);
}
it('simulates correlated results, stale replies and real fuzzy insertion', async () => {
  render(
    <ReacdProvider>
      <EditorMentionLookupExample />
    </ReacdProvider>,
  );
  const box = await screen.findByRole('textbox', { name: 'Directory lookup document' });
  expect(screen.getByText('Lookup requests: 0')).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Resolve current' })).toBeNull();
  box.focus();
  await userEvent.keyboard('@qq');
  expect(screen.getByText('Lookup requests: 3')).toBeVisible();
  expect(await screen.findByText('Loading results.')).toBeVisible();
  const first = requestKey();
  await press('Clear response');
  expect(screen.getByText('Delivered response: none')).toBeVisible();
  expect(screen.getByText('Loading results.')).toBeVisible();
  await press('Fail current');
  expect(await screen.findByRole('alert')).toHaveTextContent('Simulated lookup error.');
  await press('Empty current');
  expect(await screen.findByText('No matching results.')).toBeVisible();
  await press('Resolve current');
  expect(
    await screen.findByRole('option', { name: `Directory entry ${first}` }),
  ).toBeVisible();
  await press('Save response for replay');
  expect(screen.getByText('Lookup requests: 3')).toBeVisible();
  act(() => selectEditorText(box, 'all'));
  await userEvent.keyboard('@rr');
  const second = requestKey();
  expect(second).not.toBe(first);
  expect(screen.getByText('Lookup query: rr')).toBeVisible();
  await press('Resolve current');
  await press('Replay saved response');
  expect(
    await screen.findByRole('option', { name: `Directory entry ${second}` }),
  ).toBeVisible();
  expect(screen.queryByRole('option', { name: `Directory entry ${first}` })).toBeNull();
  act(() => selectEditorText(box, 'all'));
  await userEvent.keyboard('@qq');
  const third = requestKey();
  expect(third).not.toBe(first);
  expect(screen.getByText('Lookup query: qq')).toBeVisible();
  await press('Replay saved response');
  expect(screen.queryByRole('option', { name: `Directory entry ${first}` })).toBeNull();
  expect(screen.getByText('Loading results.')).toBeVisible();
  await press('Resolve current');
  await userEvent.click(
    await screen.findByRole('option', { name: `Directory entry ${third}` }),
  );
  await waitFor(() => expect(box.textContent).toBe(`@Directory entry ${third} `));
  await waitFor(() => expect(box).toHaveFocus());
  await press('Reset lookup document');
  await waitFor(() => expect(box.textContent).toBe(''));
  expect(screen.getByText('Lookup requests: 0')).toBeVisible();
  await userEvent.click(screen.getByRole('switch', { name: 'Reject lookup edits' }));
  box.focus();
  await userEvent.keyboard('@qq');
  expect(box.textContent).toBe('');
  const beforeProtection = screen.getByText(/^Lookup requests: /).textContent;
  await userEvent.click(
    screen.getByRole('switch', { name: 'Read-only lookup document' }),
  );
  expect(box).toHaveAttribute('aria-readonly', 'true');
  await userEvent.click(
    screen.getByRole('switch', { name: 'Disable lookup document' }),
  );
  expect(box).toHaveAttribute('aria-disabled', 'true');
  await userEvent.click(screen.getByRole('switch', { name: 'Right to left lookup' }));
  expect(screen.getByText(/^Lookup requests: /).textContent).toBe(beforeProtection);
  await press('Reset lookup document');
});

it('hydrates without requests and isolates independent provider sessions', async () => {
  const tree = (
    <ReacdProvider>
      <EditorMentionLookupExample />
    </ReacdProvider>
  );
  const markup = renderToString(tree);
  expect(markup).toContain('Lookup requests: 0');
  const container = document.createElement('div');
  container.innerHTML = markup;
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(tree, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  const other = render(tree);
  try {
    const first = await within(container).findByRole('textbox', {
      name: 'Directory lookup document',
    });
    await within(other.container).findByRole('textbox', {
      name: 'Directory lookup document',
    });
    expect(errors).toEqual([]);
    first.focus();
    await userEvent.keyboard('@qq');
    expect(within(container).getByText('Lookup requests: 3')).toBeVisible();
    expect(within(other.container).getByText('Lookup requests: 0')).toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    view.unmount();
    other.unmount();
    container.remove();
  }
});

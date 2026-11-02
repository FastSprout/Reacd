import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { ShadcnInput } from '../input/input.adapter.js';
import { ShadcnSplitter } from './splitter.adapter.js';

const panels = [
  { id: 'left', label: 'Files' },
  { id: 'right', label: 'Editor' },
];
const initial = [
  { id: 'left', share: 50 },
  { id: 'right', share: 50 },
];
afterEach(() => vi.restoreAllMocks());
function geometry() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 1000,
    height: 600,
    top: 0,
    left: 0,
    bottom: 600,
    right: 1000,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1000);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
}
it('owns real SDK panels and separators, with native keyboard candidates', async () => {
  geometry();
  const change = vi.fn();
  render(
    <ShadcnSplitter
      label="Workspace"
      panels={panels}
      value={initial}
      onValueChange={change}
    />,
  );
  const separator = screen.getByRole('separator');
  expect(screen.getByRole('group', { name: 'Workspace' })).toHaveAttribute(
    'data-group',
    'true',
  );
  expect(screen.getByRole('region', { name: 'Files' })).toBeVisible();
  expect(separator).toHaveAttribute('data-separator', 'inactive');
  separator.focus();
  await userEvent.keyboard('{ArrowRight}');
  await waitFor(() =>
    expect(change).toHaveBeenCalledWith([
      { id: 'left', share: 55 },
      { id: 'right', share: 45 },
    ]),
  );
  await waitFor(() => expect(separator).toHaveAttribute('aria-valuenow', '50'));
});
it('accepts controlled updates, percent constraints, collapse and orientation', () => {
  geometry();
  const view = render(
    <ShadcnSplitter
      label="Workspace"
      panels={panels}
      value={initial}
      onValueChange={vi.fn()}
    />,
  );
  const first = screen.getByRole('region', { name: 'Files' });
  view.rerender(
    <ShadcnSplitter
      label="Workspace"
      panels={[
        {
          ...panels[0],
          id: 'left',
          label: 'Files',
          minShare: 20,
          maxShare: 70,
          collapsedShare: 0,
        },
        { id: 'right', label: 'Editor', minShare: 30, maxShare: 100 },
      ]}
      value={[
        { id: 'left', share: 60 },
        { id: 'right', share: 40 },
      ]}
      onValueChange={vi.fn()}
      orientation="vertical"
      disabled
    />,
  );
  expect(screen.getByRole('region', { name: 'Files' })).toBe(first);
  expect(screen.getByRole('separator')).toHaveAttribute('aria-disabled', 'true');
  fireEvent.keyDown(screen.getByRole('separator'), { key: 'ArrowDown' });
});

it('uses the disabled native vertical reflow without discarding panel content', () => {
  geometry();
  const view = render(
    <ShadcnSplitter
      label="Workspace"
      panels={panels}
      value={initial}
      onValueChange={vi.fn()}
      narrow
    />,
  );
  expect(screen.queryByRole('separator')).toBeNull();
  expect(screen.getByRole('group', { name: 'Workspace' })).not.toHaveAttribute(
    'data-group',
  );
  expect(screen.getByRole('region', { name: 'Files' })).toBeVisible();
  view.rerender(
    <ShadcnSplitter
      label="Workspace"
      panels={panels}
      value={initial}
      onValueChange={vi.fn()}
      narrow={false}
      resizeLabel="Resize workspace"
    />,
  );
  expect(screen.getByRole('separator', { name: 'Resize workspace' })).toBeVisible();
});

it('keeps collapsed native panels inert and positive panels interactive', () => {
  geometry();
  const outline = vi.fn();
  const editor = vi.fn();
  const view = render(
    <ShadcnSplitter
      label="Workspace"
      panels={[
        {
          id: 'left',
          label: 'Files',
          collapsedShare: 0,
          content: (
            <ShadcnInput label="Outline" value="Draft" onValueChange={outline} />
          ),
        },
        {
          id: 'right',
          label: 'Editor',
          maxShare: 100,
          content: <ShadcnInput label="Body" value="Body" onValueChange={editor} />,
        },
      ]}
      value={[
        { id: 'left', share: 0 },
        { id: 'right', share: 100 },
      ]}
      onValueChange={vi.fn()}
      narrow={false}
    />,
  );
  const inactive = screen.getByRole('textbox', { name: 'Outline' });
  const active = screen.getByRole('textbox', { name: 'Body' });
  expect(inactive.closest('[data-panel]')).toHaveAttribute('inert');
  expect(active.closest('[data-panel]')).not.toHaveAttribute('inert');
  expect(inactive.closest('[data-panel]')?.firstElementChild).toHaveAttribute(
    'style',
    expect.stringContaining('overflow: auto'),
  );
  fireEvent.change(inactive, { target: { value: 'Blocked' } });
  fireEvent.change(active, { target: { value: 'Accepted' } });
  expect(outline).not.toHaveBeenCalled();
  expect(editor).toHaveBeenCalledExactlyOnceWith('Accepted');
  view.unmount();
});

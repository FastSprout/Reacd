import { createElement } from 'react';
import type { ComponentType } from 'react';
import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ButtonExample } from '../../docs/examples/button.js';
import { DocumentationPreview } from './preview-app.js';
import { previewEntry } from './entry.js';
import type { PreviewEntry } from './entry.js';

const { load, registry } = vi.hoisted(() => {
  const registry: Partial<Record<'Button' | 'Grid', PreviewEntry>> = {};
  return { registry, load: vi.fn<() => Promise<{ default: ComponentType }>>() };
});
vi.mock('./registry.js', () => ({
  previewRegistry: registry,
}));
beforeEach(() => {
  load.mockReset().mockResolvedValue({ default: ButtonExample });
  registry.Button = previewEntry('examples/button.tsx', load);
  registry.Grid = previewEntry('examples/grid.tsx', load);
});
afterEach(() => {
  vi.restoreAllMocks();
});
it('renders a useful error for invalid external requests', () => {
  render(createElement(DocumentationPreview, { search: '?component=constructor' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Unknown documentation preview');
  expect(load).not.toHaveBeenCalled();
});
it('loads the actual example in an isolated store per frame', async () => {
  const user = userEvent.setup();
  render(createElement(DocumentationPreview, { search: '?component=Button' }));
  render(
    createElement(DocumentationPreview, {
      search: '?component=Button&template=erp-compact&direction=rtl',
    }),
  );
  const regions = await screen.findAllByRole('region', { name: 'Button live example' });
  const first = regions.at(0);
  const second = regions.at(1);
  if (!first || !second) throw new Error('Missing independently mounted previews.');
  await user.click(
    await within(first).findByRole('button', { name: 'Request export' }),
  );
  expect(within(first).getByText('Export requests: 1')).toBeInTheDocument();
  expect(within(second).getByText('Export requests: 0')).toBeInTheDocument();
  await user.click(within(first).getByRole('switch', { name: 'Compact preview' }));
  await user.click(
    within(first).getByRole('switch', { name: 'Right to left preview' }),
  );
  expect(within(first).getByText('Export requests: 1')).toBeInTheDocument();
  expect(first.closest('[dir]')).toHaveAttribute('dir', 'rtl');
  expect(second.closest('[dir]')).toHaveAttribute('dir', 'rtl');
});
it('announces loading and safely unmounts a pending frame', async () => {
  let finish: (value: { default: ComponentType }) => void = () => {
    throw new Error('Missing import resolver.');
  };
  load.mockReturnValue(
    new Promise((resolve) => {
      finish = resolve;
    }),
  );
  const view = render(
    createElement(DocumentationPreview, { search: '?component=Button' }),
  );
  expect(screen.getByRole('status', { name: 'Loading Button example' })).toBeVisible();
  view.unmount();
  await act(async () => {
    finish({ default: ButtonExample });
  });
  expect(screen.queryByRole('status')).toBeNull();
});
it('contains failed imports and recovers on another example', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
  load.mockRejectedValueOnce(new Error('Import failed.'));
  const view = render(
    createElement(DocumentationPreview, { search: '?component=Button' }),
  );
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Cannot load Button example',
  );
  view.rerender(createElement(DocumentationPreview, { search: '?component=Grid' }));
  expect(await screen.findByRole('button', { name: 'Request export' })).toBeVisible();
  expect(screen.queryByRole('alert')).toBeNull();
});

it('switches Material UI without resetting the runnable example state', async () => {
  const user = userEvent.setup();
  render(createElement(DocumentationPreview, { search: '?component=Button' }));
  await user.click(await screen.findByRole('button', { name: 'Request export' }));
  await user.click(screen.getByRole('switch', { name: 'Material UI preview' }));
  expect(screen.getByText('Export requests: 1')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Request export' }).className).toContain(
    'MuiButton-root',
  );
  await user.click(screen.getByRole('button', { name: 'Request export' }));
  expect(screen.getByText('Export requests: 2')).toBeInTheDocument();
});

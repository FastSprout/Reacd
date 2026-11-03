import { act, render, screen, waitFor, within } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeAll, expect, it, vi } from 'vitest';
import { LivePreview } from './preview.js';
import { templates } from '@fastsprout/reacd';
import type { ThemeAdapter } from '@fastsprout/reacd';
import * as adapterLoader from './material-adapter.js';
import { previewRegistry } from '../previews/registry.js';
import { NATIVE_MODULE_IMPORT_TIMEOUT_MS } from
  '../../../test-support/native-module-policy.js';

beforeAll(async () => {
  await previewRegistry.Button.load();
  await adapterLoader.loadMaterialAdapter();
}, NATIVE_MODULE_IMPORT_TIMEOUT_MS);

afterEach(() => vi.restoreAllMocks());

const entry = { type: 'preview', key: 'button', component: 'Button' } as const;

it('defers only the lazy example while server rendering semantic page content', () => {
  const html = renderToString(<LivePreview entry={entry} appearance="light" />);
  expect(html).toContain('Loading example');
  expect(html).not.toContain('Request export');
});

it('isolates example values across native SDK changes', async () => {
  const user = userEvent.setup();
  const first = render(<LivePreview entry={entry} appearance="light" />);
  const second = render(<LivePreview entry={entry} appearance="dark" />);
  const firstView = within(first.container);
  const secondView = within(second.container);
  await user.click(await firstView.findByRole('button', { name: 'Request export' }));
  expect(firstView.getByText('Export requests: 1')).toBeVisible();
  expect(await secondView.findByText('Export requests: 0')).toBeVisible();
  await user.click(firstView.getByRole('combobox', { name: 'Example adapter' }));
  await user.click(screen.getByRole('option', { name: 'Material UI' }));
  await act(async () => {
    await adapterLoader.loadMaterialAdapter();
  });
  await waitFor(() =>
    expect(
      firstView.getByRole('button', { name: 'Request export' }).className,
    ).toContain('MuiButton-root'),
  );
  expect(firstView.getByText('Export requests: 1')).toBeVisible();
  expect(secondView.getByText('Export requests: 0')).toBeVisible();
});

it('rejects invalid preview targets', () => {
  const diagnostic = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  try {
    expect(() =>
      render(
        <LivePreview entry={{ type: 'preview', key: 'missing' }} appearance="light" />,
      ),
    ).toThrow('A preview must identify an example.');
  } finally {
    diagnostic.mockRestore();
  }
});

it('contains import failures and retains selector and state', async () => {
  const report = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  vi.spyOn(adapterLoader, 'loadMaterialAdapter').mockRejectedValueOnce(
    new Error('Native SDK request failed'),
  );
  const user = userEvent.setup();
  render(<LivePreview entry={entry} appearance="light" />);
  await user.click(await screen.findByRole('button', { name: 'Request export' }));
  await user.click(screen.getByRole('combobox', { name: 'Example adapter' }));
  await user.click(screen.getByRole('option', { name: 'Material UI' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Native SDK request failed',
  );
  expect(screen.getByRole('combobox', { name: 'Example adapter' })).toBeVisible();
  await user.click(screen.getByRole('combobox', { name: 'Example adapter' }));
  await user.click(screen.getByRole('option', { name: 'shadcn/ui' }));
  expect(await screen.findByText('Export requests: 1')).toBeVisible();
  report.mockRestore();
});

it.each(['resolve', 'reject'] as const)(
  'consumes a %s from a native SDK request after its preview unmounts',
  async (outcome) => {
    const actual = await adapterLoader.loadMaterialAdapter();
    const resolve = vi.fn<(value: ThemeAdapter) => void>();
    const reject = vi.fn<(reason: unknown) => void>();
    const promise = new Promise<ThemeAdapter>((complete, fail) => {
      resolve.mockImplementation(complete);
      reject.mockImplementation(fail);
    });
    vi.spyOn(adapterLoader, 'loadMaterialAdapter').mockReturnValueOnce(promise);
    const user = userEvent.setup();
    const first = render(<LivePreview entry={entry} appearance="light" />);
    const second = render(<LivePreview entry={entry} appearance="light" />);
    const firstView = within(first.container);
    await firstView.findByRole('button', { name: 'Request export' });
    await user.click(firstView.getByRole('combobox', { name: 'Example adapter' }));
    await user.click(screen.getByRole('option', { name: 'Material UI' }));
    expect(firstView.getByRole('status', { name: 'Loading example' })).toBeVisible();
    first.unmount();
    await act(async () => {
      if (outcome === 'resolve') resolve(actual);
      else reject(new Error('Canceled SDK request'));
      await promise.catch(() => undefined);
    });
    expect(
      await within(second.container).findByText('Export requests: 0'),
    ).toBeVisible();
  },
);

it(
  'applies the selected site design without resetting native example state',
  async () => {
  const user = userEvent.setup();
  const design = {
    ...templates['saas-modern-light'],
    colors: {
      ...templates['saas-modern-light'].colors,
      primary: '#1d4ed8',
    },
  };
  const view = render(<LivePreview entry={entry} appearance="light" design={design} />);
  const button = await screen.findByRole('button', { name: 'Request export' });
  expect(button.closest('[data-adapter]')).toHaveStyle({ '--primary': '#1d4ed8' });
  await user.click(button);
  view.rerender(<LivePreview entry={entry} appearance="dark" design={design} />);
  expect(screen.getByText('Export requests: 1')).toBeVisible();
});

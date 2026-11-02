import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SiteApplication } from './site.js';
import { sitePayload } from '../../../test-support/site-payload.js';

const actions = {
  copyText: vi.fn(async () => undefined),
  readAppearance: () => 'light' as const,
  persistAppearance: vi.fn(),
};

it('runs documentation appearance, width and source actions', async () => {
  const user = userEvent.setup();
  render(<SiteApplication payload={sitePayload} actions={actions} />);
  expect(screen.getByRole('heading', { level: 1, name: 'Get started' })).toBeVisible();
  expect(screen.getByText('Use reacd components.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Toggle dark appearance' }));
  expect(actions.persistAppearance).toHaveBeenLastCalledWith('dark');
  await user.click(screen.getByRole('button', { name: 'Toggle dark appearance' }));
  expect(actions.persistAppearance).toHaveBeenLastCalledWith('light');
  await user.click(screen.getByRole('button', { name: 'Toggle documentation width' }));
  await user.click(screen.getByRole('button', { name: 'Toggle documentation width' }));
  await user.click(screen.getByRole('button', { name: 'Copy page' }));
  expect(actions.copyText).toHaveBeenLastCalledWith(sitePayload.page.source);
  expect(await screen.findByRole('button', { name: 'Copied page' })).toBeVisible();
});

it('renders the landing page through the same closed reacd tree', async () => {
  render(
    <SiteApplication
      payload={{ ...sitePayload, page: { ...sitePayload.page, route: '/' } }}
      actions={actions}
    />,
  );
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('React views.');
  expect(screen.getByRole('link', { name: 'Get started' })).toBeVisible();
  expect(await screen.findByRole('button', { name: 'Connect account' })).toBeVisible();
});

it('subscribes the app search state to the trusted host shortcut', async () => {
  let notify: () => void = () => undefined;
  const close = vi.fn();
  const subscription = (callback: () => void) => {
    notify = callback;
    return close;
  };
  const view = render(
    <SiteApplication
      payload={sitePayload}
      actions={{
        ...actions,
        subscribeSearchShortcut: subscription,
      }}
    />,
  );
  await act(async () => {
    notify();
  });
  expect(screen.getByRole('dialog', { name: 'Search documentation' })).toBeVisible();
  await act(async () => {
    notify();
  });
  expect(screen.queryByRole('dialog')).toBeNull();
  view.unmount();
  expect(close).toHaveBeenCalledOnce();
});

it('keeps example state across document appearance changes', async () => {
  const user = userEvent.setup();
  render(
    <SiteApplication
      payload={{
        ...sitePayload,
        page: {
          ...sitePayload.page,
          sections: [
            {
              type: 'preview',
              key: 'button',
              component: 'Button',
            },
          ],
        },
      }}
      actions={actions}
    />,
  );
  await user.click(await screen.findByRole('button', { name: 'Request export' }));
  await user.click(screen.getByRole('button', { name: 'Toggle dark appearance' }));
  expect(screen.getByText('Export requests: 1')).toBeVisible();
});

it('restores dark appearance and reports source copying failures', async () => {
  const user = userEvent.setup();
  render(
    <SiteApplication
      payload={sitePayload}
      actions={{
        ...actions,
        readAppearance: () => 'dark',
        copyText: async () => {
          throw new Error('Clipboard unavailable');
        },
      }}
    />,
  );
  await user.click(screen.getByRole('button', { name: 'Copy page' }));
  await waitFor(() =>
    expect(screen.getByText('Copy failed. Try again.')).toBeVisible(),
  );
  expect(screen.getByText('Use reacd components.')).toBeVisible();
});

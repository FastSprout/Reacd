import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { MuiPagination } from './pagination.adapter.js';
it('uses native Material pagination with controlled zero-based values', async () => {
  const change = vi.fn<() => void>();
  render(
    <MuiPagination
      label="Orders"
      totalItems={60}
      value={{ pageIndex: 0, pageSize: 10 }}
      onValueChange={change}
    />,
  );
  const nav = screen.getByRole('navigation', { name: 'Orders' });
  expect(nav.className).toContain('MuiPagination-root');
  await userEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));
  expect(change).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 });
  expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 6');
});
it('uses native bounded controls for empty and read-only datasets', () => {
  render(
    <MuiPagination
      label="Orders"
      totalItems={0}
      value={{ pageIndex: 0, pageSize: 10 }}
      showControls={false}
      showEdges={false}
      siblingCount={0}
      size="small"
    />,
  );
  expect(
    screen.queryByRole('button', { name: 'Go to next page' }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'page 1' })).toBeDisabled();
});
it('maps native page links and preserves browser-modified activation', async () => {
  const change = vi.fn<() => boolean>(() => false);
  const view = render(
    <MuiPagination
      label="Orders"
      totalItems={100}
      value={{ pageIndex: 3, pageSize: 10 }}
      onValueChange={change}
      navigation={{ href: '/orders?status=open#results' }}
    />,
  );
  const link = screen.getByRole('link', { name: 'Go to page 2' });
  expect(link).toHaveAttribute(
    'href',
    '/orders?status=open&page=2&pageSize=10#results',
  );
  await userEvent.click(link);
  expect(change).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 });
  change.mockClear();
  link.addEventListener('click', (event) => event.preventDefault());
  for (const modifier of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey']) {
    fireEvent.click(link, { [modifier]: true });
  }
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <PortalActiveContext value={false}>
      <MuiPagination
        label="Orders"
        totalItems={100}
        value={{ pageIndex: 3, pageSize: 10 }}
        navigation={{ href: '/orders' }}
      />
    </PortalActiveContext>,
  );
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});
it('keeps URL links usable without a state callback', () => {
  const assign = vi.fn<(href: string) => void>();
  vi.stubGlobal('location', { assign });
  try {
    render(
      <MuiPagination
        label="Orders"
        totalItems={1000}
        value={{ pageIndex: 40, pageSize: 10 }}
        navigation={{ href: '/orders' }}
      />,
    );
    const link = screen.getByRole('link', { name: 'Go to page 42' });
    fireEvent.click(link);
    expect(assign).toHaveBeenCalledWith('/orders?page=42&pageSize=10');
  } finally {
    vi.unstubAllGlobals();
  }
});

it('captures the URL before a synchronous host update', async () => {
  const assign = vi.fn<(href: string) => void>();
  vi.stubGlobal('location', { assign });
  try {
    const change = vi.fn(() => {
      view.rerender(
        <MuiPagination
          label="Orders"
          totalItems={100}
          value={{ pageIndex: 3, pageSize: 10 }}
          navigation={{ href: '/changed' }}
        />,
      );
      return true;
    });
    const view = render(
      <MuiPagination
        label="Orders"
        totalItems={100}
        value={{ pageIndex: 3, pageSize: 10 }}
        navigation={{ href: '/orders' }}
        onValueChange={change}
      />,
    );
    await userEvent.click(screen.getByRole('link', { name: 'Go to page 2' }));
    expect(assign).toHaveBeenCalledWith('/orders?page=2&pageSize=10');
    expect(change).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 });
  } finally {
    vi.unstubAllGlobals();
  }
});

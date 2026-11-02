import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnPagination } from './pagination.adapter.js';

function Pages() {
  const [value, change] = useState({ pageIndex: 1, pageSize: 10 });
  return (
    <ShadcnPagination
      label="Orders"
      totalItems={30}
      value={value}
      onValueChange={change}
    />
  );
}
it('uses SDK pagination and buttons for controlled keyboard navigation', async () => {
  render(<Pages />);
  expect(screen.getByRole('navigation', { name: 'Orders' })).toHaveAttribute(
    'data-slot',
    'pagination',
  );
  await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 3 of 3');
  expect(document.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  await userEvent.click(screen.getByRole('button', { name: 'First page' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
  const next = screen.getByRole('button', { name: 'Next page' });
  next.focus();
  await userEvent.keyboard('{Enter}');
  expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
  await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
  await userEvent.click(screen.getByRole('button', { name: 'Last page' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 3 of 3');
});

it('bounds huge lists and maps compact presentation options', () => {
  const view = render(
    <ShadcnPagination
      label="Orders"
      totalItems={1000000000}
      value={{ pageIndex: 500, pageSize: 10 }}
      onValueChange={() => undefined}
      size="large"
    />,
  );
  expect(screen.getAllByRole('button').length).toBeLessThan(15);
  expect(
    view.container.querySelectorAll('[data-slot="pagination-ellipsis"]'),
  ).toHaveLength(2);
  view.rerender(
    <ShadcnPagination
      label="Orders"
      totalItems={0}
      value={{ pageIndex: 0, pageSize: 10 }}
      size="small"
      siblingCount={0}
      showControls={false}
      showEdges={false}
    />,
  );
  expect(screen.queryByRole('button', { name: 'Next page' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'First page' })).toBeNull();
  expect(screen.getByRole('button', { name: 'Page 1' })).toBeDisabled();
  expect(screen.getByRole('status')).toHaveTextContent('0 items');
});

it('preserves native URL destinations and browser-modified activation', () => {
  const change = vi.fn(() => false);
  render(
    <ShadcnPagination
      label="Orders"
      totalItems={100}
      value={{ pageIndex: 3, pageSize: 10 }}
      onValueChange={change}
      navigation={{ href: '/orders?status=open#results' }}
    />,
  );
  const link = screen.getByRole('link', { name: 'Next page' });
  link.addEventListener('click', (event) => event.preventDefault());
  expect(link).toHaveAttribute('data-slot', 'pagination-link');
  expect(link).toHaveAttribute(
    'href',
    '/orders?status=open&page=5&pageSize=10#results',
  );
  for (const modifier of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey']) {
    fireEvent.click(link, { [modifier]: true });
  }
  fireEvent.click(link, { button: 1 });
  expect(change).not.toHaveBeenCalled();
  fireEvent.click(link);
  expect(change).toHaveBeenCalledWith({ pageIndex: 4, pageSize: 10 });
});

it('captures the original href before a synchronous accepting callback', () => {
  const assign = vi.fn();
  vi.stubGlobal('location', { assign });
  try {
    const value = { pageIndex: 1, pageSize: 10 };
    const view = render(
      <ShadcnPagination
        label="Orders"
        totalItems={100}
        value={value}
        navigation={{ href: '/orders' }}
        onValueChange={() => {
          view.rerender(
            <ShadcnPagination
              label="Orders"
              totalItems={100}
              value={value}
              navigation={{ href: '/changed' }}
            />,
          );
          return true;
        }}
      />,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Next page' }));
    expect(assign).toHaveBeenCalledWith('/orders?page=3&pageSize=10');
  } finally {
    vi.unstubAllGlobals();
  }
});

it('keeps native links and disables inactive state controls', () => {
  const view = render(
    <ShadcnPagination
      label="Orders"
      totalItems={30}
      value={{ pageIndex: 0, pageSize: 10 }}
      navigation={{ href: '/orders' }}
    />,
  );
  const next = screen.getByRole('link', { name: 'Next page' });
  expect(next).toHaveAttribute('href', '/orders?page=2&pageSize=10');
  next.addEventListener('click', (event) => event.preventDefault());
  fireEvent.click(next);
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnPagination
        label="Orders"
        totalItems={30}
        value={{ pageIndex: 0, pageSize: 10 }}
        onValueChange={() => undefined}
      />
    </PortalActiveContext>,
  );
  expect(screen.queryByRole('link')).toBeNull();
  expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
});

it('retains disabled URL link semantics without an active destination', () => {
  const change = vi.fn();
  render(
    <ShadcnPagination
      label="Reader"
      totalItems={30}
      disabled
      value={{ pageIndex: 1, pageSize: 10 }}
      navigation={{ href: '/orders' }}
      onValueChange={change}
    />,
  );
  for (const link of screen.getAllByRole('link')) {
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('tabindex', '-1');
    fireEvent.click(link);
  }
  expect(change).not.toHaveBeenCalled();
});

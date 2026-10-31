import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Pagination, ReacdProvider } from '../../../index.js';
import { followHref } from '../../../renderer/navigation/native-navigation.js';
vi.mock('../../../renderer/navigation/native-navigation.js', () => ({
  followHref: vi.fn(),
}));

describe('shadcn Pagination', () => {
  it('keeps a rejected state transition on the current route', () => {
    vi.mocked(followHref).mockClear();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Pagination
          label="Rejected navigation"
          totalItems={30}
          value={{ pageIndex: 0, pageSize: 10 }}
          navigation={{ href: '/orders' }}
          onValueChange={() => false}
        />
      </ReacdProvider>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Next page' }));
    expect(followHref).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
  });
  it('pages with controlled values and marks exactly one current choice', async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState({ pageIndex: 0, pageSize: 10 });
      return (
        <ReacdProvider adapter={shadcnAdapter}>
          <Pagination
            label="Results"
            totalItems={100}
            value={value}
            onValueChange={setValue}
          />
        </ReacdProvider>
      );
    }
    render(<Example />);
    const nav = screen.getByRole('navigation', { name: 'Results' });
    expect(nav.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(within(nav).getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(within(nav).getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await user.click(within(nav).getByRole('button', { name: 'Page 1' }));
    await user.click(within(nav).getByRole('button', { name: 'Next page' }));
    expect(within(nav).getByRole('status')).toHaveTextContent('Page 2 of 10');
    await user.click(within(nav).getByRole('button', { name: 'Last page' }));
    expect(within(nav).getByRole('button', { name: 'Last page' })).toBeDisabled();
    expect(within(nav).getByRole('button', { name: 'Next page' })).toBeDisabled();
    await user.click(within(nav).getByRole('button', { name: 'Previous page' }));
    await user.click(within(nav).getByRole('button', { name: 'First page' }));
    expect(within(nav).getByRole('status')).toHaveTextContent('Page 1 of 10');
  });
  it('has read-only, disabled and empty modes without unusable extra pages', () => {
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Pagination
          label="Readonly"
          totalItems={0}
          value={{ pageIndex: 0, pageSize: 10 }}
        />
      </ReacdProvider>,
    );
    for (const control of screen.getAllByRole('button')) expect(control).toBeDisabled();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <Pagination
          label="Readonly"
          totalItems={90}
          value={{ pageIndex: 4, pageSize: 10 }}
          onValueChange={() => undefined}
          showControls={false}
          showEdges={false}
          siblingCount={0}
          disabled
          size="large"
        />
      </ReacdProvider>,
    );
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
  });
  it('builds safe URLs and keeps modifier activation out of local state', () => {
    const change = vi.fn();
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Pagination
          label="Linked pages"
          totalItems={30}
          value={{ pageIndex: 0, pageSize: 10 }}
          onValueChange={change}
          navigation={{ href: '/orders?status=open#results' }}
        />
      </ReacdProvider>,
    );
    const next = screen.getByRole('link', { name: 'Next page' });
    expect(next).toHaveAttribute(
      'href',
      '/orders?status=open&page=2&pageSize=10#results',
    );
    const cancel = (event: Event) => event.preventDefault();
    document.addEventListener('click', cancel);
    try {
      fireEvent.click(next, { button: 0 });
      expect(change).toHaveBeenCalledExactlyOnceWith({ pageIndex: 1, pageSize: 10 });
      expect(followHref).toHaveBeenCalledExactlyOnceWith(
        expect.stringContaining('/orders?status=open&page=2&pageSize=10#results'),
      );
      change.mockClear();
      for (const modifier of ['metaKey', 'ctrlKey', 'altKey', 'shiftKey']) {
        fireEvent.click(next, { button: 0, [modifier]: true });
      }
      fireEvent.click(next, { button: 1 });
      expect(change).not.toHaveBeenCalled();
      const prevented = new MouseEvent('click', { bubbles: true, cancelable: true });
      prevented.preventDefault();
      fireEvent(next, prevented);
      expect(change).not.toHaveBeenCalled();
      const previous = screen.getByRole('link', { name: 'Previous page' });
      fireEvent.click(previous);
      expect(previous).toHaveAttribute('aria-disabled', 'true');
      expect(previous).not.toHaveAttribute('href');
      view.rerender(
        <ReacdProvider adapter={shadcnAdapter}>
          <Pagination
            label="Linked pages"
            totalItems={30}
            value={{ pageIndex: 0, pageSize: 10 }}
            navigation={{ href: '/orders' }}
          />
        </ReacdProvider>,
      );
      fireEvent.click(screen.getByRole('link', { name: 'Next page' }));
      expect(change).not.toHaveBeenCalled();
    } finally {
      document.removeEventListener('click', cancel);
    }
  });
});

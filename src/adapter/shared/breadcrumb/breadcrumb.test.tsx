import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen, within } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb, ReacdProvider } from '../../../index.js';
describe('shadcn Breadcrumb', () => {
  it('renders ordered links, plain current text and decorative separators', () => {
    render(
      <ReacdProvider adapter={activeTestAdapter}>
        <Breadcrumb
          label="Current path"
          items={[
            { key: 'home', label: 'Home', href: '/' },
            {
              key: 'disabled',
              label: 'Unavailable',
              href: '/unavailable',
              disabled: true,
            },
            { key: 'current', label: 'Current record' },
          ]}
        />
      </ReacdProvider>,
    );
    const nav = screen.getByRole('navigation', { name: 'Current path' });
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(within(nav).queryByRole('link', { name: 'Unavailable' })).toBeNull();
    expect(within(nav).getByText('Current record')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
  it('runs actions, ignores disabled ones and supports current links', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const view = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <Breadcrumb
          label="Actions"
          separator="slash"
          items={[
            { key: 'action', label: 'Open projects', onPress: action },
            {
              key: 'disabled',
              label: 'Disabled action',
              onPress: action,
              disabled: true,
            },
            { key: 'current', label: 'Current record', href: '/records/current' },
          ]}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Open projects' }));
    await user.click(screen.getByRole('button', { name: 'Disabled action' }));
    expect(action).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: 'Current record' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <Breadcrumb
          label="Single"
          items={[{ key: 'current', label: 'Current action', onPress: action }]}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
  });
});

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../../index.js';
import { Timeline } from '../../../components/timeline/timeline.js';

const items = [
  { id: 'design', title: 'Design', date: 'March 22', description: 'Review designs.' },
  { id: 'build', title: 'Build' },
  { id: 'ship', title: 'Ship', disabled: true },
];
describe('shadcn Timeline', () => {
  it('renders chronological statuses, optional dates and readonly titles', () => {
    const view = render(
      <ReacdProvider>
        <Timeline label="Delivery" items={items} />
      </ReacdProvider>,
    );
    expect(screen.getByRole('list', { name: 'Delivery' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('March 22')).toBeInTheDocument();
    expect(screen.getByText('Review designs.')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeNull();
    for (const intent of ['primary', 'secondary', 'danger'] as const) {
      view.rerender(
        <ReacdProvider templateId="erp-compact">
          <Timeline
            label="Delivery"
            items={items}
            value="build"
            reverse
            orientation="horizontal"
            intent={intent}
          />
        </ReacdProvider>,
      );
      expect(screen.getByRole('list')).toHaveAttribute('data-intent', intent);
      expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('UpcomingShip');
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
    }
  });
  it('requests controlled keyboard selection', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ReacdProvider>
        <Timeline
          label="Delivery"
          items={items}
          value="design"
          onValueChange={change}
        />
      </ReacdProvider>,
    );
    screen.getByRole('button', { name: 'Build' }).focus();
    await user.keyboard('{Enter}');
    expect(change).toHaveBeenCalledWith('build');
    expect(screen.getAllByRole('listitem')[0]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: 'Ship' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Ship' }));
    expect(change).toHaveBeenCalledOnce();
  });
});

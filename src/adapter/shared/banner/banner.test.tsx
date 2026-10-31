import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReacdProvider, Button } from '../../../index.js';
import { Banner } from '../../../components/banner/banner.js';

describe('shadcn Banner', () => {
  it('requests dismissal and waits for host visibility', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const action = vi.fn();
    const view = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <Banner
          title="Maintenance"
          description="Save before midnight."
          open
          onOpenChange={change}
          dismissible
          actions={<Button label="Save work" onPress={action} />}
        />
      </ReacdProvider>,
    );
    expect(screen.getByRole('status', { name: 'Maintenance' })).toHaveTextContent(
      'Save before midnight.',
    );
    await user.click(screen.getByRole('button', { name: 'Save work' }));
    expect(action).toHaveBeenCalledOnce();
    screen.getByRole('button', { name: 'Dismiss banner' }).focus();
    await user.keyboard(' ');
    expect(change).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toBeInTheDocument();
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter} templateId="erp-compact">
        <Banner title="Maintenance" open={false} onOpenChange={change} />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('supports every intent, optional content and custom close labels', () => {
    const change = vi.fn();
    const view = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <Banner title="Notice" open onOpenChange={change} />
      </ReacdProvider>,
    );
    expect(screen.queryByRole('button')).toBeNull();
    for (const intent of ['info', 'success', 'warning', 'error'] as const) {
      view.rerender(
        <ReacdProvider adapter={activeTestAdapter}>
          <Banner
            title="Notice"
            open
            onOpenChange={change}
            intent={intent}
            dismissible
            closeLabel="Hide notice"
          />
        </ReacdProvider>,
      );
      expect(
        screen.getByRole(
          intent === 'error' || intent === 'warning' ? 'alert' : 'status',
          { name: 'Notice' },
        ),
      ).toHaveAttribute('data-intent', intent);
      expect(screen.getByRole('button', { name: 'Hide notice' })).toBeInTheDocument();
    }
  });
});

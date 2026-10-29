import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar, Button, Empty, Input, ReacdProvider, Text } from '../../../index.js';

describe('shadcn Empty', () => {
  it('names a region and supports a minimal empty state', () => {
    render(
      <ReacdProvider>
        <Empty title="No records" />
      </ReacdProvider>,
    );
    const region = screen.getByRole('region', { name: 'No records' });
    expect(region).toHaveAttribute('data-loading', 'false');
    expect(region).not.toHaveAttribute('aria-describedby');
    expect(within(region).getByRole('heading')).toHaveTextContent('No records');
    expect(within(region).queryByRole('status')).toBeNull();
  });
  it('preserves child values across busy and appearance changes', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    function Draft() {
      const [value, setValue] = useState('');
      return <Input label="Recovery query" value={value} onValueChange={setValue} />;
    }
    function Scene({
      variant = 'outline',
      loading = false,
      compact = false,
    }: {
      variant?: 'outline' | 'solid' | 'soft' | 'subtle' | 'naked';
      loading?: boolean;
      compact?: boolean;
    }) {
      return (
        <ReacdProvider templateId={compact ? 'erp-compact' : 'saas-modern-light'}>
          <Empty
            title="No matches"
            description="Change the query to continue."
            variant={variant}
            loading={loading}
            loadingLabel="Refreshing matches"
            leading={<Avatar name="Local reader" />}
            actions={<Button label="Retry query" onPress={action} />}
            footer={<Text>Local recovery example</Text>}
          >
            <Draft />
          </Empty>
        </ReacdProvider>
      );
    }
    const view = render(<Scene />);
    const region = screen.getByRole('region', { name: 'No matches' });
    expect(region).toHaveAccessibleDescription('Change the query to continue.');
    expect(
      within(region).getByRole('img', { name: 'Local reader' }),
    ).toBeInTheDocument();
    await user.type(screen.getByLabelText('Recovery query'), 'Saved query');
    for (const variant of ['solid', 'soft', 'subtle', 'naked', 'outline'] as const) {
      view.rerender(<Scene variant={variant} loading compact />);
      expect(screen.getByLabelText('Recovery query')).toHaveValue('Saved query');
      expect(region).toHaveAttribute('data-variant', variant);
      expect(region).toHaveAttribute('data-loading', 'true');
      expect(region.querySelector('[data-slot="empty-content"]')).toHaveAttribute(
        'aria-busy',
        'true',
      );
    }
    expect(within(region).getByRole('status')).toHaveTextContent('Refreshing matches');
    expect(within(region).getByRole('status').closest('[aria-busy="true"]')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Retry query' }));
    expect(action).toHaveBeenCalledOnce();
    expect(within(region).getByText('Local recovery example')).toBeInTheDocument();
    view.rerender(<Scene loading />);
    expect(screen.getByLabelText('Recovery query')).toHaveValue('Saved query');
  });
  it('uses its default loading label and supports all logical sizes', () => {
    const view = render(
      <ReacdProvider>
        <Empty title="Pending" loading />
      </ReacdProvider>,
    );
    expect(screen.getByRole('status')).toHaveTextContent('Loading');
    for (const size of ['small', 'medium', 'large'] as const) {
      view.rerender(
        <ReacdProvider>
          <Empty title="Pending" size={size} />
        </ReacdProvider>,
      );
      expect(screen.getByRole('region')).toHaveAttribute('data-size', size);
    }
  });
});

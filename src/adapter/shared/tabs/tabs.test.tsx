import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { useState } from 'react';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { App, Button, ReacdProvider, Tabs, Text } from '../../../index.js';

function Count() {
  const [count, setCount] = useState(0);
  return <Button label={`Count ${count}`} onPress={() => setCount(count + 1)} />;
}

function Example({
  manual = false,
  vertical = false,
  rtl = false,
  shared = false,
}: {
  manual?: boolean;
  vertical?: boolean;
  rtl?: boolean;
  shared?: boolean;
}) {
  const [value, setValue] = useState('profile');
  return (
    <ReacdProvider adapter={activeTestAdapter}>
      <App direction={rtl ? 'rtl' : 'ltr'}>
        <Tabs
          label="Settings"
          value={value}
          onValueChange={setValue}
          orientation={vertical ? 'vertical' : 'horizontal'}
          activationMode={manual ? 'manual' : 'automatic'}
          items={[
            {
              value: 'profile',
              label: 'Profile',
              content: shared ? undefined : <Count />,
            },
            { value: 'blocked', label: 'Unavailable', disabled: true },
            {
              value: 'billing',
              label: 'Billing',
              content: <Text>Billing content</Text>,
            },
          ]}
        >
          <Count />
        </Tabs>
      </App>
    </ReacdProvider>
  );
}

describe('accessible controlled tabs', () => {
  it('retains hidden panel state and connects triggers to panels', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const profile = screen.getByRole('tab', { name: 'Profile' });
    const panel = screen.getByRole('tabpanel', { name: 'Profile' });
    expect(profile).toHaveAttribute('aria-controls', panel.id);
    await user.click(screen.getByRole('button', { name: 'Count 0' }));
    await user.click(screen.getByRole('tab', { name: 'Billing' }));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Unavailable' })).toBeDisabled();
    await user.click(profile);
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeVisible();
  });

  it('supports automatic RTL and vertical keys with disabled skipping', async () => {
    const user = userEvent.setup();
    const view = render(<Example rtl />);
    screen.getByRole('tab', { name: 'Profile' }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    view.unmount();
    render(<Example vertical />);
    screen.getByRole('tab', { name: 'Profile' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
  });

  it('separates manual focus from selection and retains shared content', async () => {
    const user = userEvent.setup();
    render(<Example manual shared />);
    await user.click(screen.getByRole('button', { name: 'Count 0' }));
    screen.getByRole('tab', { name: 'Profile' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Profile' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await user.keyboard('{Enter}');
    expect(screen.getByRole('tabpanel', { name: 'Billing' })).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Profile' }));
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeVisible();
  });

  it('server-renders one accessible selected panel and closed native props', () => {
    const output = renderToString(<Example />);
    expect(output).toContain('role="tablist"');
    expect(output).toContain('hidden=""');
    expect(output).not.toContain('role="alert"');
  });
});

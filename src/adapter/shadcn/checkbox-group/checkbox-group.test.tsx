import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxGroup, ReacdProvider } from '../../../index.js';

const items = [
  { value: 'locked', label: 'Locked channel', disabled: true },
  { value: 'email', label: 'Email channel', description: 'Email description' },
  { value: 'sms', label: 'SMS channel' },
];
describe('shadcn CheckboxGroup', () => {
  it('enforces max without losing keyboard access or disabled selections', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Scene() {
      const [value, setValue] = useState<readonly string[]>(['locked']);
      return (
        <ReacdProvider>
          <CheckboxGroup
            label="Channels"
            description="Choose channels"
            max={2}
            items={items}
            value={value}
            onValueChange={(next) => {
              change(next);
              setValue(next);
            }}
          />
        </ReacdProvider>
      );
    }
    render(<Scene />);
    const email = screen.getByRole('checkbox', { name: 'Email channel' });
    const sms = screen.getByRole('checkbox', { name: 'SMS channel' });
    expect(email).toHaveAccessibleDescription('Email description');
    await user.click(screen.getByText('Email channel'));
    expect(change).toHaveBeenLastCalledWith(['locked', 'email']);
    expect(sms).toHaveAttribute('aria-disabled', 'true');
    await user.click(sms);
    expect(change).toHaveBeenCalledOnce();
    email.focus();
    await user.tab();
    expect(sms).toHaveFocus();
    await user.click(email);
    expect(sms).not.toHaveAttribute('aria-disabled', 'true');
    sms.focus();
    await user.keyboard(' ');
    expect(change).toHaveBeenLastCalledWith(['locked', 'sms']);
    expect(screen.getByRole('checkbox', { name: 'Locked channel' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
  it('supports required unlimited groups and rejected controlled writes', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const view = render(
      <ReacdProvider>
        <CheckboxGroup
          label="Channels"
          items={items}
          value={[]}
          required
          name="channels"
          orientation="horizontal"
          onValueChange={change}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Email channel' }));
    expect(change).toHaveBeenCalledExactlyOnceWith(['email']);
    expect(screen.getByRole('checkbox', { name: 'Email channel' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    view.rerender(
      <ReacdProvider>
        <CheckboxGroup
          label="Channels"
          items={items}
          value={[]}
          disabled
          required
          onValueChange={change}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('checkbox', { name: 'Email channel' }));
    expect(change).toHaveBeenCalledOnce();
  });
});

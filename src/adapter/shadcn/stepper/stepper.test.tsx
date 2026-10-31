import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { App, ReacdProvider, Stepper, Text } from '../../../index.js';

const items = [
  {
    key: 'one',
    title: 'Address',
    description: 'Choose an address.',
    content: <Text>Address fields</Text>,
  },
  { key: 'blocked', title: 'Blocked step', disabled: true },
  { key: 'two', title: 'Payment', content: <Text>Payment fields</Text> },
  { key: 'three', title: 'Confirm' },
];

function ControlledStepper() {
  const [value, setValue] = useState('one');
  return (
    <Stepper label="Checkout" items={items} value={value} onValueChange={setValue} />
  );
}

describe('shadcn Stepper', () => {
  it('gates enabled steps and leaves transitions to the host', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <ControlledStepper />
      </ReacdProvider>,
    );
    expect(screen.getByRole('button', { name: /Confirm/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Blocked step/ })).toBeDisabled();
    const current = screen.getByRole('button', { name: /Address/ });
    expect(current).toHaveAttribute('aria-current', 'step');
    await user.click(current);
    current.focus();
    await user.keyboard('{ArrowRight}');
    const payment = screen.getByRole('button', { name: /Payment/ });
    expect(payment).toHaveFocus();
    expect(current).toHaveAttribute('aria-current', 'step');
    await user.keyboard('{Enter}');
    expect(payment).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('region', { name: /Payment/ })).toHaveTextContent(
      'Payment fields',
    );
    expect(screen.getByRole('button', { name: /Confirm/ })).not.toBeDisabled();
    await user.keyboard('{Home}');
    expect(current).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('button', { name: /Confirm/ })).toHaveFocus();
    await user.keyboard(' ');
    expect(screen.queryByText('Payment fields')).toBeNull();
  });
  it('honors host refusal, nonlinear mode and disabled focus targets', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Stepper
          label="Controlled"
          items={items}
          value="three"
          linear={false}
          onValueChange={change}
        />
      </ReacdProvider>,
    );
    const address = screen.getByRole('button', { name: /Address/ });
    await user.click(address);
    expect(change).toHaveBeenCalledWith('one');
    expect(screen.getByRole('button', { name: /Confirm/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <Stepper
          label="Controlled"
          items={items}
          value="one"
          onValueChange={change}
          disabled
        />
      </ReacdProvider>,
    );
    expect(
      screen.getAllByRole('button').every((button) => button.hasAttribute('disabled')),
    ).toBe(true);
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <Stepper
          label="Controlled"
          items={items}
          value="three"
          onValueChange={change}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: /Confirm/ }));
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <Stepper label="Controlled" items={items} value="one" onValueChange={change} />
      </ReacdProvider>,
    );
    expect(address).toHaveAttribute('tabindex', '0');
    address.focus();
    await user.keyboard('x');
    expect(address).toHaveFocus();
  });
  it('moves RTL focus without changing state', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <App direction="rtl">
          <Stepper label="RTL steps" items={items} value="one" onValueChange={change} />
        </App>
      </ReacdProvider>,
    );
    screen.getByRole('button', { name: /Address/ }).focus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: /Payment/ })).toHaveFocus();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <App direction="rtl">
          <Stepper
            label="RTL steps"
            orientation="vertical"
            items={items}
            value="one"
            onValueChange={change}
          />
        </App>
      </ReacdProvider>,
    );
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('button', { name: /Address/ })).toHaveFocus();
    expect(change).not.toHaveBeenCalled();
  });
});

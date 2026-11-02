import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DirectionProvider } from '@radix-ui/react-direction';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnStepper } from './stepper.adapter.js';

const items = [
  {
    key: 'address',
    title: 'Address',
    description: 'Delivery',
    content: 'Address form',
  },
  { key: 'disabled', title: 'Unavailable', disabled: true, content: 'Not available' },
  { key: 'payment', title: 'Payment', content: 'Payment form' },
  { key: 'confirm', title: 'Confirm', content: 'Confirmation' },
];
function Checkout() {
  const [value, change] = useState('address');
  return (
    <ShadcnStepper
      label="Checkout"
      items={items}
      value={value}
      onValueChange={change}
    />
  );
}

it('uses SDK controls with linear eligibility and disabled gaps', async () => {
  render(<Checkout />);
  const address = screen.getByRole('button', { name: 'Address' });
  expect(address.className).toContain('bg-primary');
  expect(address).toHaveAttribute('aria-current', 'step');
  expect(address).toHaveAccessibleDescription('Delivery');
  expect(screen.getByRole('region', { name: 'Address' })).toHaveTextContent(
    'Address form',
  );
  expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
  await userEvent.click(screen.getByRole('button', { name: 'Payment' }));
  expect(screen.getByRole('button', { name: 'Payment' })).toHaveAttribute(
    'aria-current',
    'step',
  );
  expect(screen.queryByRole('region', { name: 'Address' })).toBeNull();
  expect(screen.getByRole('region', { name: 'Payment' })).toHaveTextContent(
    'Payment form',
  );
  await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
  expect(screen.getByRole('region', { name: 'Confirm' })).toHaveTextContent(
    'Confirmation',
  );
  await userEvent.click(address);
  expect(address).toHaveAttribute('aria-current', 'step');
});

it.each([
  ['horizontal', 'ltr', '{ArrowRight}'],
  ['horizontal', 'rtl', '{ArrowLeft}'],
  ['vertical', 'ltr', '{ArrowDown}'],
] as const)(
  'delegates %s %s keyboard navigation to Toolbar',
  async (orientation, direction, forward) => {
    const change = vi.fn();
    render(
      <DirectionProvider dir={direction}>
        <ShadcnStepper
          label="Checkout"
          items={items}
          value="address"
          orientation={orientation}
          linear={false}
          onValueChange={change}
        />
      </DirectionProvider>,
    );
    const address = screen.getByRole('button', { name: 'Address' });
    const payment = screen.getByRole('button', { name: 'Payment' });
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    address.focus();
    await userEvent.keyboard(forward);
    expect(payment).toHaveFocus();
    expect(change).not.toHaveBeenCalled();
    await userEvent.keyboard('{End}');
    expect(confirm).toHaveFocus();
    await userEvent.keyboard(forward);
    expect(confirm).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(address).toHaveFocus();
    await userEvent.keyboard(forward);
    await userEvent.keyboard('{Enter}');
    expect(change).toHaveBeenCalledExactlyOnceWith('payment');
    expect(address).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('region', { name: 'Address' })).toBeVisible();
    change.mockClear();
    await userEvent.keyboard(' ');
    expect(change).toHaveBeenCalledExactlyOnceWith('payment');
  },
);

it('blocks global and inactive-owner requests', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnStepper
      label="Checkout"
      items={items}
      value="address"
      disabled
      onValueChange={change}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Payment' }));
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnStepper
        label="Checkout"
        items={items}
        value="address"
        onValueChange={change}
      />
    </PortalActiveContext>,
  );
  expect(screen.getByRole('button', { name: 'Address' })).toBeDisabled();
  await userEvent.click(screen.getByRole('button', { name: 'Payment' }));
  expect(change).not.toHaveBeenCalled();
});

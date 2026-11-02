import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ReacdProvider, Stepper } from '../../../index.js';
import { shadcnAdapter } from '../shadcn.adapter.js';

function Example() {
  return (
    <ReacdProvider adapter={shadcnAdapter}>
      <Stepper
        label="Checkout"
        value="address"
        onValueChange={() => undefined}
        items={[
          { key: 'address', title: 'Address', content: 'Delivery details' },
          { key: 'payment', title: 'Payment', content: 'Payment details' },
        ]}
      />
    </ReacdProvider>
  );
}

it('renders and hydrates the native registry entry with stable content ids', () => {
  const container = document.createElement('div');
  container.innerHTML = renderToString(<Example />);
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(<Example />, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  const button = screen.getByRole('button', { name: 'Address' });
  const region = screen.getByRole('region', { name: 'Address' });
  expect(region).toHaveTextContent('Delivery details');
  expect(region).toHaveAttribute('aria-labelledby', button.id);
  expect(button).toHaveAttribute('aria-controls', region.id);
  expect(screen.queryByText('Payment details')).toBeNull();
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});

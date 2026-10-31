import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundInputNumber } from './bound-input-number.js';
import { BoundPinInput } from './bound-pin-input.js';
import type { StateRegistry } from '../registry/registry.types.js';

const definitions = [
  { key: 'quantity', kind: 'nullableNumber', initial: 1.5, access: 'readWrite' },
  { key: 'code', kind: 'text', initial: '001', access: 'readWrite' },
];
function Scene({ registry }: { registry: StateRegistry }) {
  return (
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundInputNumber
        registry={registry}
        node={{
          type: 'InputNumber',
          label: 'Amount',
          locale: 'de-DE',
          value: { state: 'quantity', mode: 'readWrite' },
        }}
      />
      <BoundPinInput
        registry={registry}
        actions={{}}
        node={{
          type: 'PinInput',
          label: 'Code',
          value: { state: 'code', mode: 'readWrite' },
        }}
      />
    </ReacdProvider>
  );
}
it('hydrates numeric/PIN labels with isolated state', async () => {
  const user = userEvent.setup();
  const server = success(createStateRegistry(definitions));
  const client = success(createStateRegistry(definitions));
  const container = document.createElement('div');
  container.innerHTML = renderToString(<Scene registry={server} />);
  document.body.appendChild(container);
  const id = screen.getByRole('textbox', { name: 'Amount' }).id;
  const errors: unknown[] = [];
  const view = render(<Scene registry={client} />, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  expect(screen.getByRole('textbox', { name: 'Amount' }).id).toBe(id);
  expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue('1,5');
  await user.clear(screen.getByRole('textbox', { name: 'Code' }));
  expect(success(client.read('code')).value).toBe('');
  expect(success(server.read('code')).value).toBe('001');
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});

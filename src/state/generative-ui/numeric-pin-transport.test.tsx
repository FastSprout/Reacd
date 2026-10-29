import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const state = [
  { key: 'amount', kind: 'nullableNumber', initial: null, access: 'readWrite' },
  { key: 'code', kind: 'text', initial: '', access: 'readWrite' },
];
const document = {
  schemaVersion: '0.2',
  state,
  root: {
    type: 'VStack',
    children: [
      {
        type: 'InputNumber',
        label: 'Amount',
        min: 0,
        max: 10,
        value: { state: 'amount', mode: 'readWrite' },
      },
      {
        type: 'InputNumber',
        label: 'Amount reader',
        value: { state: 'amount', mode: 'read' },
      },
      {
        type: 'PinInput',
        label: 'Code',
        completeAction: 'verify',
        value: { state: 'code', mode: 'readWrite' },
      },
    ],
  },
};
describe('numeric and PIN generative transport', () => {
  it('renders transport with shared state and host actions', async () => {
    const user = userEvent.setup();
    const registry = success(createStateRegistry(state));
    const verify = vi.fn();
    render(
      <GenerativeUI document={document} registry={registry} actions={{ verify }} />,
    );
    await user.click(screen.getByRole('button', { name: 'Increase Amount' }));
    expect(screen.getByRole('textbox', { name: 'Amount reader' })).toHaveValue('0');
    await user.type(screen.getByRole('textbox', { name: 'Code' }), '001234');
    expect(success(registry.read('code')).value).toBe('001234');
    expect(verify).toHaveBeenCalledExactlyOnceWith({ state: registry });
    await user.clear(screen.getByRole('textbox', { name: 'Amount' }));
    expect(success(registry.read('amount')).value).toBeNull();
  });
  it('rejects unregistered completion actions before exposing controls', () => {
    render(<GenerativeUI document={document} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Action is not registered');
    expect(screen.queryByRole('textbox')).toBeNull();
  });
  it('rejects invalid bound values before rendering', () => {
    render(
      <GenerativeUI
        document={{
          ...document,
          state: [
            { key: 'amount', kind: 'nullableNumber', initial: 11, access: 'readWrite' },
            { key: 'code', kind: 'text', initial: '', access: 'readWrite' },
          ],
        }}
        actions={{ verify() {} }}
      />,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).toBeNull();
  });
});

import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const definitions = [
  { key: 'checked', kind: 'boolean', initial: false, access: 'readWrite' },
  { key: 'mixed', kind: 'boolean', initial: true, access: 'readWrite' },
];
const documentModel = {
  schemaVersion: '0.2',
  state: definitions,
  root: {
    type: 'VStack',
    children: [
      {
        type: 'Checkbox',
        label: 'Approval writer',
        checked: { state: 'checked', mode: 'readWrite' },
        indeterminate: { state: 'mixed', mode: 'read' },
      },
      {
        type: 'Checkbox',
        label: 'Approval reader',
        checked: { state: 'checked', mode: 'read' },
      },
    ],
  },
};

it('hydrates isolated checkbox readers and host mixed state', async () => {
  const user = userEvent.setup();
  const server = success(createStateRegistry(definitions));
  const client = success(createStateRegistry(definitions));
  const container = document.createElement('div');
  const ui = (
    <GenerativeUI adapter={shadcnAdapter} document={documentModel} registry={server} />
  );
  container.innerHTML = renderToString(ui);
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(
    <GenerativeUI adapter={shadcnAdapter} document={documentModel} registry={client} />,
    {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    },
  );
  try {
    const writer = screen.getByRole('checkbox', { name: 'Approval writer' });
    await user.click(writer);
    expect(success(client.read('checked')).value).toBe(true);
    expect(success(client.read('mixed')).value).toBe(true);
    expect(writer).toHaveAttribute('aria-checked', 'mixed');
    act(() => {
      expect(client.update('mixed', false).success).toBe(true);
    });
    expect(writer).toHaveAttribute('aria-checked', 'true');
    const reader = screen.getByRole('checkbox', { name: 'Approval reader' });
    expect(reader).toHaveAttribute('aria-readonly', 'true');
    await user.click(reader);
    expect(success(client.read('checked')).value).toBe(true);
    expect(success(server.read('checked')).value).toBe(false);
    expect(errors).toEqual([]);
  } finally {
    view.unmount();
    container.remove();
  }
});

it('rejects incompatible mixed-state kinds before rendering checkbox controls', () => {
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        ...documentModel,
        state: [
          definitions[0],
          { key: 'mixed', kind: 'text', initial: 'mixed', access: 'readWrite' },
        ],
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  expect(screen.queryByRole('checkbox')).toBeNull();
});

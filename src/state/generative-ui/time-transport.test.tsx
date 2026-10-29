import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const definitions = [
  { key: 'arrival', kind: 'time', initial: '12:30:00', access: 'readWrite' },
  {
    key: 'shift',
    kind: 'timeRange',
    access: 'readWrite',
    initial: { start: '09:00:00', end: '17:00:00' },
  },
];
const documentModel = {
  schemaVersion: '0.2',
  state: definitions,
  root: {
    type: 'VStack',
    children: [
      {
        type: 'InputTime',
        label: 'Arrival',
        min: '09:00:00',
        max: '17:00:00',
        value: { state: 'arrival', mode: 'readWrite' },
      },
      {
        type: 'InputTime',
        mode: 'single',
        label: 'Arrival reader',
        value: { state: 'arrival', mode: 'read' },
      },
      {
        type: 'InputTime',
        mode: 'range',
        label: 'Shift',
        value: { state: 'shift', mode: 'readWrite' },
      },
    ],
  },
};

it('hydrates canonical time transport with isolated server/client stores', async () => {
  const user = userEvent.setup();
  const server = success(createStateRegistry(definitions));
  const client = success(createStateRegistry(definitions));
  const container = document.createElement('div');
  container.innerHTML = renderToString(
    <GenerativeUI document={documentModel} registry={server} />,
  );
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const view = render(<GenerativeUI document={documentModel} registry={client} />, {
    container,
    hydrate: true,
    onRecoverableError: (error) => errors.push(error),
  });
  screen.getByRole('spinbutton', { name: /hour, Arrival$/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(success(client.read('arrival')).value).toBe('13:30:00');
  expect(success(server.read('arrival')).value).toBe('12:30:00');
  expect(
    screen.getByRole('spinbutton', { name: /hour, Arrival reader/i }),
  ).toHaveAttribute('aria-valuenow', '13');
  expect(screen.getByRole('button', { name: 'Clear Arrival reader' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Clear End Shift' }));
  expect(success(client.read('shift')).value).toEqual({ start: '09:00:00', end: null });
  expect(success(server.read('shift')).value).toEqual({
    start: '09:00:00',
    end: '17:00:00',
  });
  act(() => {
    expect(client.update('arrival', '18:00:00').success).toBe(false);
  });
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});

it('rejects incompatible kinds before exposing an editable time field', () => {
  render(
    <GenerativeUI
      document={{
        ...documentModel,
        state: [
          { key: 'arrival', kind: 'text', access: 'readWrite', initial: '12:30:00' },
        ],
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.queryByRole('spinbutton')).toBeNull();
});

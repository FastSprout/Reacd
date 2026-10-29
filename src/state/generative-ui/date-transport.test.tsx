import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const definitions = [
  { key: 'event', kind: 'date', initial: '2024-02-28', access: 'readWrite' },
  {
    key: 'booking',
    kind: 'dateRange',
    access: 'readWrite',
    initial: { start: '2024-02-28', end: '2024-03-01' },
  },
];
const documentModel = {
  schemaVersion: '0.2',
  state: definitions,
  root: {
    type: 'VStack',
    children: [
      {
        type: 'InputDate',
        label: 'Event',
        referenceDate: '2024-02-28',
        min: '2024-02-01',
        max: '2024-03-01',
        value: { state: 'event', mode: 'readWrite' },
      },
      {
        type: 'InputDate',
        mode: 'single',
        label: 'Event reader',
        referenceDate: '2024-02-28',
        value: { state: 'event', mode: 'read' },
      },
      {
        type: 'InputDate',
        mode: 'range',
        label: 'Booking',
        referenceDate: '2024-02-28',
        value: { state: 'booking', mode: 'readWrite' },
      },
    ],
  },
};

it('hydrates dates with isolated state and shared constraints', async () => {
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
  screen.getByRole('spinbutton', { name: /day, Event$/i }).focus();
  await user.keyboard('{ArrowUp}');
  expect(success(client.read('event')).value).toBe('2024-02-29');
  expect(success(server.read('event')).value).toBe('2024-02-28');
  expect(
    screen.getByRole('spinbutton', { name: /day, Event reader/i }),
  ).toHaveAttribute('aria-valuenow', '29');
  expect(screen.getByRole('button', { name: 'Clear Event reader' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Clear End Booking' }));
  expect(success(client.read('booking')).value).toEqual({
    start: '2024-02-28',
    end: null,
  });
  expect(success(server.read('booking')).value).toEqual({
    start: '2024-02-28',
    end: '2024-03-01',
  });
  act(() => {
    expect(client.update('event', '2024-03-02').success).toBe(false);
  });
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});

it('rejects malformed references and incompatible state before rendering', () => {
  const { unmount } = render(
    <GenerativeUI
      document={{
        ...documentModel,
        root: {
          type: 'InputDate',
          label: 'Invalid reference',
          referenceDate: '2024-02-30',
          value: { state: 'event', mode: 'readWrite' },
        },
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.queryByRole('spinbutton')).toBeNull();
  unmount();
  render(
    <GenerativeUI
      document={{
        ...documentModel,
        state: [
          { key: 'event', kind: 'text', access: 'readWrite', initial: '2024-02-28' },
        ],
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.queryByRole('spinbutton')).toBeNull();
});

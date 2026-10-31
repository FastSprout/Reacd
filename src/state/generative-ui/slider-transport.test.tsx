import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const GEOMETRY = { width: 200, height: 44 };
const definitions = [
  { key: 'level', kind: 'number', initial: 20, access: 'readWrite' },
  {
    key: 'range',
    kind: 'numberRange',
    initial: { start: 20, end: 80 },
    access: 'readWrite',
  },
];
const documentModel = {
  schemaVersion: '0.2',
  state: definitions,
  root: {
    type: 'VStack',
    children: [
      {
        type: 'Slider',
        label: 'Level',
        min: 0,
        max: 100,
        value: { state: 'level', mode: 'readWrite' },
      },
      {
        type: 'Slider',
        label: 'Price',
        mode: 'range',
        min: 0,
        max: 100,
        value: { state: 'range', mode: 'readWrite' },
      },
      {
        type: 'Slider',
        label: 'Reader',
        mode: 'range',
        min: 0,
        max: 100,
        value: { state: 'range', mode: 'read' },
      },
    ],
  },
};

it('hydrates isolated slider state and constrains host writes', async () => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => new DOMRect(0, 0, GEOMETRY.width, GEOMETRY.height),
  );
  const user = userEvent.setup();
  const server = success(createStateRegistry(definitions));
  const client = success(createStateRegistry(definitions));
  const container = document.createElement('div');
  container.innerHTML = renderToString(
    <GenerativeUI adapter={shadcnAdapter} document={documentModel} registry={server} />,
  );
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
    const level = await screen.findByRole('slider', { name: 'Level' });
    act(() => level.focus());
    await user.keyboard('{ArrowRight}');
    const minimum = screen.getByRole('slider', { name: 'Minimum Price' });
    act(() => minimum.focus());
    await user.keyboard('{ArrowRight}');
    expect(success(client.read('level')).value).toBe(21);
    expect(success(client.read('range')).value).toEqual({ start: 21, end: 80 });
    expect(success(server.read('level')).value).toBe(20);
    expect(success(server.read('range')).value).toEqual({ start: 20, end: 80 });
    expect(client.update('range', { start: 0, end: 101 }).success).toBe(false);
    expect(client.update('level', 101).success).toBe(false);
    expect(screen.getByRole('slider', { name: 'Minimum Reader' })).toHaveAttribute(
      'aria-valuenow',
      '21',
    );
    expect(errors).toEqual([]);
  } finally {
    view.unmount();
    container.remove();
  }
});

it('rejects range references targeting a number before rendering', () => {
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        ...documentModel,
        state: [
          definitions[0],
          { key: 'range', kind: 'number', initial: 20, access: 'readWrite' },
        ],
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  expect(screen.queryByRole('slider')).toBeNull();
});

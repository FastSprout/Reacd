import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];
const definitions = [
  { key: 'one', kind: 'text', initial: 'a', access: 'readWrite' },
  { key: 'many', kind: 'selection', initial: ['a'], access: 'readWrite' },
];
const documentModel = {
  schemaVersion: '0.2',
  state: definitions,
  root: {
    type: 'VStack',
    children: [
      {
        type: 'Select',
        label: 'Writer',
        items: items.map((item) => ({ ...item })),
        clearable: true,
        value: { state: 'one', mode: 'readWrite' },
      },
      {
        type: 'Select',
        label: 'Many writer',
        mode: 'multiple',
        items: items.map((item) => ({ ...item })),
        clearable: true,
        value: { state: 'many', mode: 'readWrite' },
      },
      {
        type: 'Select',
        label: 'Many reader',
        mode: 'multiple',
        items: items.map((item) => ({ ...item })),
        value: { state: 'many', mode: 'read' },
      },
    ],
  },
};

it('hydrates isolated modes and constrains host writes', async () => {
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
    await user.click(screen.getByRole('button', { name: 'Clear Writer' }));
    await user.click(screen.getByRole('button', { name: 'Clear Many writer' }));
    expect(success(client.read('one')).value).toBe('');
    expect(success(client.read('many')).value).toEqual([]);
    act(() => {
      expect(client.update('one', 'missing').success).toBe(false);
      expect(client.update('many', ['missing']).success).toBe(false);
      expect(client.update('many', ['b']).success).toBe(true);
    });
    expect(screen.getByRole('combobox', { name: 'Many reader' })).toHaveTextContent(
      'Beta',
    );
    expect(success(server.read('many')).value).toEqual(['a']);
    expect(success(server.read('one')).value).toBe('a');
    expect(errors).toEqual([]);
  } finally {
    view.unmount();
    container.remove();
  }
});

it('rejects mode-kind mismatch before any choice control mounts', () => {
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        ...documentModel,
        state: [
          definitions[0],
          { key: 'many', kind: 'text', initial: 'a', access: 'readWrite' },
        ],
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  expect(screen.queryByRole('combobox')).toBeNull();
});

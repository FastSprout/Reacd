import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const state = [
  { key: 'topics', kind: 'selection', initial: ['React'], access: 'readWrite' },
];
const document = {
  schemaVersion: '0.2',
  state,
  root: {
    type: 'InputTags',
    label: 'Topics',
    value: { state: 'topics', mode: 'readWrite' },
    maxTags: 3,
    maxTagLength: 8,
  },
};
describe('tags transport and hydration', () => {
  it('hydrates labelled tags and keeps server and client state isolated', async () => {
    const user = userEvent.setup();
    const server = success(createStateRegistry(state));
    const client = success(createStateRegistry(state));
    const container = globalThis.document.createElement('div');
    container.innerHTML = renderToString(
      <GenerativeUI document={document} registry={server} />,
    );
    globalThis.document.body.appendChild(container);
    const id = screen.getByRole('combobox', { name: 'Topics' }).id;
    const errors: unknown[] = [];
    const view = render(<GenerativeUI document={document} registry={client} />, {
      container,
      hydrate: true,
      onRecoverableError: (error) => errors.push(error),
    });
    const input = screen.getByRole('combobox', { name: 'Topics' });
    expect(input.id).toBe(id);
    await user.type(input, 'Vue{Enter}');
    expect(success(client.read('topics')).value).toEqual(['React', 'Vue']);
    expect(success(server.read('topics')).value).toEqual(['React']);
    expect(errors).toEqual([]);
    view.unmount();
    container.remove();
  });
  it('rejects malformed initial bound values before rendering', () => {
    render(
      <GenerativeUI
        document={{
          ...document,
          state: [
            {
              key: 'topics',
              kind: 'selection',
              initial: ['oversized-token'],
              access: 'readWrite',
            },
          ],
        }}
      />,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).toBeNull();
  });
});

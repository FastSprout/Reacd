import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';

const definitions = [
  { key: 'publish', kind: 'boolean', initial: false, access: 'readWrite' },
  { key: 'notes', kind: 'text', initial: 'Draft', access: 'readWrite' },
  { key: 'error', kind: 'text', initial: 'Review pending', access: 'readWrite' },
];
const documentModel = {
  schemaVersion: '0.2',
  state: definitions,
  root: {
    type: 'VStack',
    children: [
      {
        type: 'FormField',
        name: 'review',
        label: 'Review',
        error: { state: 'error', mode: 'read' },
        children: [
          {
            type: 'Textarea',
            label: 'Notes',
            maxLength: 8,
            minLength: 4,
            value: { state: 'notes', mode: 'readWrite' },
          },
        ],
      },
      {
        type: 'FormField',
        name: 'reader',
        children: [
          {
            type: 'Textarea',
            label: 'Reader',
            value: { state: 'notes', mode: 'read' },
          },
        ],
      },
      {
        type: 'Switch',
        label: 'Publish',
        checked: { state: 'publish', mode: 'readWrite' },
      },
      {
        type: 'Switch',
        label: 'Reader switch',
        checked: { state: 'publish', mode: 'read' },
      },
    ],
  },
};

it('hydrates recursive fields with isolated server/client stores', async () => {
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
  const notes = screen.getByRole('textbox', { name: 'Notes' });
  expect(notes).toHaveAccessibleDescription('Review pending');
  act(() => {
    expect(client.update('error', '').success).toBe(true);
  });
  expect(screen.getByRole('textbox', { name: 'Notes' })).toBe(notes);
  expect(notes).not.toHaveAttribute('aria-invalid');
  fireEvent.change(notes, { target: { value: 'x' } });
  expect(success(client.read('notes')).value).toBe('x');
  expect(success(server.read('notes')).value).toBe('Draft');
  expect(screen.getByRole('textbox', { name: 'Reader' })).toHaveValue('x');
  expect(screen.getByRole('textbox', { name: 'Reader' })).toHaveAttribute('readonly');
  await user.click(screen.getByRole('switch', { name: 'Publish' }));
  expect(screen.getByRole('switch', { name: 'Reader switch' })).toHaveAttribute(
    'aria-checked',
    'true',
  );
  act(() => {
    expect(client.update('notes', 'over budget').success).toBe(false);
  });
  expect(errors).toEqual([]);
  view.unmount();
  container.remove();
});

it('validates literal, empty and incompatible error bindings', () => {
  const { rerender } = render(
    <GenerativeUI
      document={{
        schemaVersion: '0.2',
        state: [],
        root: {
          type: 'FormField',
          name: 'literal',
          error: 'Rejected',
          children: [{ type: 'Text', content: 'Read-only review' }],
        },
      }}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Rejected');
  rerender(
    <GenerativeUI
      document={{
        schemaVersion: '0.2',
        state: [],
        root: { type: 'FormField', name: 'empty', children: [] },
      }}
    />,
  );
  expect(screen.queryByRole('alert')).toBeNull();
  rerender(
    <GenerativeUI
      document={{
        ...documentModel,
        state: definitions.map((definition) =>
          definition.key === 'error'
            ? { key: 'error', kind: 'boolean', initial: false, access: 'readWrite' }
            : definition,
        ),
      }}
    />,
  );
  expect(screen.getByRole('alert')).toBeVisible();
  expect(screen.queryByRole('textbox')).toBeNull();
});

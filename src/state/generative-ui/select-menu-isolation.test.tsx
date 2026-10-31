import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';

const items = [{ value: '42', label: 'Answer' }];
const node = {
  type: 'SelectMenu',
  label: 'Isolated records',
  items,
  value: { state: 'selected', mode: 'read' },
};

it('uses isolated stores for readonly multiple and writable single selection', () => {
  const state = [
    { key: 'selected', kind: 'selection', initial: ['42'], access: 'readWrite' },
  ];
  const registry = createStateRegistry(state);
  if (!registry.success) throw new Error('Missing registry.');
  const first = render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{ schemaVersion: '0.2', state, root: { ...node, mode: 'multiple' } }}
      registry={registry.data}
    />,
  );
  expect(screen.getByRole('combobox')).toHaveAttribute('aria-readonly', 'true');
  act(() => {
    expect(registry.data.update('selected', []).success).toBe(true);
  });
  expect(screen.getByRole('combobox')).toHaveTextContent('Choose an option.');
  first.unmount();
  const singleState = [
    { key: 'selected', kind: 'text', initial: '42', access: 'readWrite' },
  ];
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        schemaVersion: '0.2',
        state: singleState,
        root: {
          ...node,
          readOnly: true,
          value: { state: 'selected', mode: 'readWrite' },
        },
      }}
    />,
  );
  expect(screen.getByRole('combobox')).toHaveTextContent('Answer');
  expect(screen.getByRole('combobox')).toHaveAttribute('aria-readonly', 'true');
  expect(registry.data.read('selected')).toMatchObject({ data: { value: [] } });
});

it('rejects missing membership and atomic multiline query writes', () => {
  const state = [
    { key: 'selected', kind: 'text', initial: '42', access: 'readWrite' },
    { key: 'query', kind: 'text', initial: '', access: 'readWrite' },
  ];
  const registry = createStateRegistry(state);
  if (!registry.success) throw new Error('Missing registry.');
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        schemaVersion: '0.2',
        state,
        root: { ...node, query: { state: 'query', mode: 'readWrite' } },
      }}
      registry={registry.data}
    />,
  );
  act(() => {
    expect(
      registry.data.transaction([
        { key: 'selected', value: '' },
        { key: 'query', value: 'line\nbreak' },
      ]).success,
    ).toBe(false);
  });
  expect(registry.data.read('selected')).toMatchObject({ data: { value: '42' } });
  expect(
    validateGenerativeDocument({
      schemaVersion: '0.2',
      state: [{ ...state[0], key: 'selected', initial: 'missing' }],
      root: node,
    }).success,
  ).toBe(false);
});

it('writes a single canonical key without optional state channels', async () => {
  const user = userEvent.setup();
  const state = [{ key: 'selected', kind: 'text', initial: '', access: 'readWrite' }];
  const registry = createStateRegistry(state);
  if (!registry.success) throw new Error('Missing registry.');
  render(
    <GenerativeUI
      adapter={shadcnAdapter}
      document={{
        schemaVersion: '0.2',
        state,
        root: { ...node, value: { state: 'selected', mode: 'readWrite' } },
      }}
      registry={registry.data}
    />,
  );
  await user.click(screen.getByRole('combobox', { name: node.label }));
  await user.click(await screen.findByRole('option', { name: 'Answer' }));
  expect(registry.data.read('selected')).toMatchObject({ data: { value: '42' } });
  act(() => {
    expect(registry.data.reset().success).toBe(true);
  });
  expect(screen.getByRole('combobox', { name: node.label })).toHaveTextContent(
    'Choose an option.',
  );
});

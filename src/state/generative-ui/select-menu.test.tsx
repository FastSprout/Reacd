import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';

const items = [
  { value: '42', label: 'Answer' },
  { value: 'beta', label: 'Beta' },
];
const definitions = [
  { key: 'single', kind: 'text', initial: '42', access: 'readWrite' },
  { key: 'many', kind: 'selection', initial: [], access: 'readWrite' },
  { key: 'query', kind: 'text', initial: '', access: 'readWrite' },
  { key: 'open', kind: 'boolean', initial: false, access: 'readWrite' },
];
const single = {
  type: 'SelectMenu',
  label: 'Records',
  items,
  value: { state: 'single', mode: 'read' },
  query: { state: 'query', mode: 'readWrite' },
  open: { state: 'open', mode: 'readWrite' },
};

it('allows query writes while a read selection remains unchanged', async () => {
  const user = userEvent.setup();
  const registry = createStateRegistry(definitions);
  if (!registry.success) throw new Error('Missing registry.');
  render(
    <GenerativeUI
      document={{ schemaVersion: '0.2', state: definitions, root: single }}
      registry={registry.data}
    />,
  );
  await user.click(screen.getByRole('combobox', { name: 'Records' }));
  await user.type(
    await screen.findByRole('combobox', { name: 'Search Records' }),
    'beta',
  );
  await user.click(screen.getByRole('option', { name: 'Beta' }));
  expect(registry.data.read('single')).toMatchObject({ data: { value: '42' } });
  expect(registry.data.read('query')).toMatchObject({ data: { value: 'beta' } });
  expect(registry.data.read('open')).toMatchObject({ data: { value: true } });
});

it('writes multiple keys and rejects an invalid transaction', async () => {
  const user = userEvent.setup();
  const registry = createStateRegistry(definitions);
  if (!registry.success) throw new Error('Missing registry.');
  const node = {
    ...single,
    mode: 'multiple',
    value: { state: 'many', mode: 'readWrite' },
    query: { state: 'query', mode: 'read' },
  };
  render(
    <GenerativeUI
      document={{ schemaVersion: '0.2', state: definitions, root: node }}
      registry={registry.data}
    />,
  );
  await user.click(screen.getByRole('combobox', { name: 'Records' }));
  expect(
    await screen.findByRole('combobox', { name: 'Search Records' }),
  ).toHaveAttribute('readonly');
  await user.click(screen.getByRole('option', { name: 'Answer' }));
  expect(registry.data.read('many')).toMatchObject({ data: { value: ['42'] } });
  act(() => {
    expect(
      registry.data.transaction([
        { key: 'many', value: ['missing'] },
        { key: 'query', value: 'new query' },
      ]).success,
    ).toBe(false);
  });
  expect(registry.data.read('many')).toMatchObject({ data: { value: ['42'] } });
  expect(registry.data.read('query')).toMatchObject({ data: { value: '' } });
});

it('rejects query aliases and non-writable controlled disclosure', () => {
  for (const root of [
    { ...single, query: { state: 'single', mode: 'readWrite' } },
    { ...single, open: { state: 'open', mode: 'read' } },
  ])
    expect(
      validateGenerativeDocument({ schemaVersion: '0.2', state: definitions, root })
        .success,
    ).toBe(false);
});

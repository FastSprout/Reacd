import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { validateGenerativeDocument } from '../../schema/generative-v2/index.js';
import { BoundInputMenu } from './bound-input-menu.js';
import { BoundInputMenuOpen } from './bound-input-menu-open.js';

const definitions = [
  { key: 'text', kind: 'text', initial: '', access: 'readWrite' },
  { key: 'open', kind: 'boolean', initial: false, access: 'readWrite' },
];
const node = {
  type: 'InputMenu',
  label: 'Bound destination',
  items: [{ value: 'a', label: 'Alpha' }],
  value: { state: 'text', mode: 'readWrite' },
} as const;

it('binds text/disclosure and protects read mirrors', async () => {
  const user = userEvent.setup();
  const registry = createStateRegistry(definitions);
  if (!registry.success) throw new Error('Missing registry.');
  const document = {
    schemaVersion: '0.2',
    state: definitions,
    root: { ...node, open: { state: 'open', mode: 'readWrite' } },
  };
  expect(validateGenerativeDocument(document).success).toBe(true);
  const view = render(<GenerativeUI document={document} registry={registry.data} />);
  await user.click(screen.getByRole('combobox', { name: node.label }));
  expect(registry.data.read('open')).toMatchObject({ data: { value: true } });
  await user.click(screen.getByRole('option', { name: 'Alpha' }));
  expect(registry.data.read('text')).toMatchObject({ data: { value: 'Alpha' } });
  expect(registry.data.read('open')).toMatchObject({ data: { value: false } });
  view.rerender(
    <GenerativeUI
      document={{
        ...document,
        root: { ...node, value: { state: 'text', mode: 'read' } },
      }}
      registry={registry.data}
    />,
  );
  const input = screen.getByRole('combobox', { name: node.label });
  expect(input).toHaveAttribute('readonly');
  await user.type(input, 'ignored');
  expect(registry.data.read('text')).toMatchObject({ data: { value: 'Alpha' } });
});

it('vetoes constrained text without closing or publication', async () => {
  const user = userEvent.setup();
  const registry = createStateRegistry(definitions);
  if (!registry.success) throw new Error('Missing registry.');
  render(
    <GenerativeUI
      document={{
        schemaVersion: '0.2',
        state: definitions,
        root: node,
      }}
      registry={registry.data}
    />,
  );
  const lease = registry.data.constrain(['text'], (read) => {
    const value = read('text');
    return value.success && value.data.value === ''
      ? { success: true, data: undefined }
      : { success: false, issues: [{ path: 'text', message: 'Host veto.' }] };
  });
  if (!lease.success) throw new Error('Missing lease.');
  await user.click(screen.getByRole('combobox', { name: node.label }));
  await user.click(screen.getByRole('option', { name: 'Alpha' }));
  expect(screen.getByRole('listbox')).toBeVisible();
  expect(registry.data.read('text')).toMatchObject({ data: { value: '' } });
  act(() => {
    expect(registry.data.transaction([{ key: 'text', value: 'Alpha' }]).success).toBe(
      false,
    );
  });
  lease.data();
});

it('renders direct binding issues and rejects non-writable open transport', () => {
  const registry = createStateRegistry(definitions);
  if (!registry.success) throw new Error('Missing registry.');
  const view = render(
    <BoundInputMenu
      registry={registry.data}
      node={{ ...node, value: { state: 'missing', mode: 'read' } }}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('not registered');
  view.rerender(
    <BoundInputMenuOpen
      registry={registry.data}
      reference={{ state: 'text', mode: 'readWrite' }}
      properties={{
        label: node.label,
        value: '',
        items: [],
        onValueChange: () => undefined,
      }}
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('incompatible');
  expect(
    validateGenerativeDocument({
      schemaVersion: '0.2',
      state: definitions,
      root: { ...node, open: { state: 'open', mode: 'read' } },
    }).success,
  ).toBe(false);
  expect(
    validateGenerativeDocument({
      schemaVersion: '0.2',
      state: definitions,
      root: { ...node, onSuggestionSelect: 'action' },
    }).success,
  ).toBe(false);
});

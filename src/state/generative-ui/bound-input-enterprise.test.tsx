import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundInput } from './bound-input.js';

const node = {
  type: 'Input',
  label: 'Email',
  inputType: 'email',
  maxLength: 20,
  minLength: 8,
  value: { state: 'email', mode: 'readWrite' },
} as const;

it('shares readable drafts while protecting readers and maximum host writes', () => {
  const registry = success(
    createStateRegistry([
      { key: 'email', kind: 'text', initial: '', access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundInput node={node} registry={registry} />
      <BoundInput
        node={{ ...node, label: 'Reader', value: { state: 'email', mode: 'read' } }}
        registry={registry}
      />
      <BoundInput
        node={{ ...node, label: 'Protected', readOnly: true }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  fireEvent.change(screen.getByRole('textbox', { name: 'Email' }), {
    target: { value: 'x' },
  });
  expect(success(registry.read('email')).value).toBe('x');
  expect(screen.getByRole('textbox', { name: 'Reader' })).toHaveValue('x');
  expect(screen.getByRole('textbox', { name: 'Reader' })).toHaveAttribute('readonly');
  expect(screen.getByRole('textbox', { name: 'Protected' })).toHaveAttribute(
    'readonly',
  );
  act(() => {
    expect(registry.update('email', 'x'.repeat(21)).success).toBe(false);
  });
  expect(success(registry.read('email')).value).toBe('x');
});

it('reports missing or over-budget current bindings without interactive fields', () => {
  const registry = success(
    createStateRegistry([
      { key: 'email', kind: 'text', initial: 'x'.repeat(21), access: 'readWrite' },
    ]),
  );
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <BoundInput node={node} registry={registry} />
      <BoundInput
        node={{ ...node, value: { state: 'missing', mode: 'readWrite' } }}
        registry={registry}
      />
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  expect(screen.queryByRole('textbox')).toBeNull();
});

import { act, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { FormControls } from '../../../test-support/form-controls.js';
import { success } from '../../../test-support/data-table.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { Textarea } from '../../components/textarea/index.js';
import { BoundFormField } from './bound-form-field.js';

const node = {
  type: 'FormField',
  name: 'notes',
  label: 'Details',
  error: { state: 'error', mode: 'read' },
} as const;

it('updates errors without remounting or losing canonical values', () => {
  const registry = success(
    createStateRegistry([
      { key: 'error', kind: 'text', initial: 'Rejected', access: 'readWrite' },
    ]),
  );
  render(
    <FormControls>
      <BoundFormField node={node} registry={registry}>
        <Textarea label="Notes" value="Retained" onValueChange={vi.fn()} />
      </BoundFormField>
    </FormControls>,
  );
  const control = screen.getByRole('textbox');
  expect(control).toHaveAttribute('aria-invalid', 'true');
  expect(control).toHaveAccessibleDescription('Rejected');
  act(() => {
    expect(registry.update('error', '').success).toBe(true);
  });
  expect(screen.getByRole('textbox')).toBe(control);
  expect(control).toHaveValue('Retained');
  expect(control).not.toHaveAttribute('aria-invalid');
  expect(screen.queryByRole('alert')).toBeNull();
});

it('renders literal/no errors and reports unresolved error-state references', () => {
  const registry = success(createStateRegistry([]));
  const { rerender } = render(
    <FormControls>
      <BoundFormField node={{ ...node, error: 'Literal' }} registry={registry}>
        {null}
      </BoundFormField>
    </FormControls>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Literal');
  rerender(
    <FormControls>
      <BoundFormField node={{ type: 'FormField', name: 'plain' }} registry={registry}>
        {null}
      </BoundFormField>
    </FormControls>,
  );
  expect(screen.queryByRole('alert')).toBeNull();
  rerender(
    <FormControls>
      <BoundFormField node={node} registry={registry}>
        {null}
      </BoundFormField>
    </FormControls>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent(/error/);
  expect(screen.queryByRole('group')).toBeNull();
});

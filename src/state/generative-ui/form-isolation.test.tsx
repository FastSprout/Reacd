import { act, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { FormControls } from '../../../test-support/form-controls.js';
import { success } from '../../../test-support/data-table.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { BoundTextarea } from './bound-textarea.js';

it('isolates shared logical field keys between host stores', () => {
  const first = success(
    createStateRegistry([
      { key: 'notes', kind: 'text', initial: 'First', access: 'readWrite' },
    ]),
  );
  const second = success(
    createStateRegistry([
      { key: 'notes', kind: 'text', initial: 'Second', access: 'readWrite' },
    ]),
  );
  const node = {
    type: 'Textarea',
    label: 'First notes',
    value: { state: 'notes', mode: 'readWrite' },
  } as const;
  render(
    <FormControls>
      <BoundTextarea node={node} registry={first} />
      <BoundTextarea node={{ ...node, label: 'Second notes' }} registry={second} />
    </FormControls>,
  );
  act(() => {
    expect(first.update('notes', 'Changed').success).toBe(true);
  });
  expect(screen.getByRole('textbox', { name: 'First notes' })).toHaveValue('Changed');
  expect(screen.getByRole('textbox', { name: 'Second notes' })).toHaveValue('Second');
});

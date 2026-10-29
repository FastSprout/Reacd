import { act, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { FormControls } from '../../../test-support/form-controls.js';
import { success } from '../../../test-support/data-table.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { BoundSwitch } from './bound-switch.js';
import { BoundTextarea } from './bound-textarea.js';

const switchNode = {
  type: 'Switch',
  label: 'Publish',
  checked: { state: 'publish', mode: 'readWrite' },
} as const;
const textNode = {
  type: 'Textarea',
  label: 'Notes',
  maxLength: 8,
  minLength: 4,
  value: { state: 'notes', mode: 'readWrite' },
} as const;

it('shares boolean readers and protects explicit readonly', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'publish', kind: 'boolean', access: 'readWrite', initial: false },
    ]),
  );
  render(
    <FormControls>
      <BoundSwitch node={switchNode} registry={registry} />
      <BoundSwitch
        node={{
          ...switchNode,
          label: 'Reader',
          name: 'published',
          checked: { state: 'publish', mode: 'read' },
        }}
        registry={registry}
      />
      <BoundSwitch
        node={{ ...switchNode, label: 'Protected', readOnly: true }}
        registry={registry}
      />
    </FormControls>,
  );
  await user.click(screen.getByRole('switch', { name: 'Publish' }));
  expect(success(registry.read('publish')).value).toBe(true);
  const reader = screen.getByRole('switch', { name: 'Reader' });
  expect(reader).toHaveAttribute('aria-checked', 'true');
  expect(reader).toHaveAttribute('aria-readonly', 'true');
  await user.click(reader);
  await user.click(screen.getByRole('switch', { name: 'Protected' }));
  expect(success(registry.read('publish')).value).toBe(true);
});

it('constrains maximum host text writes while allowing minimum-length drafts', () => {
  const registry = success(
    createStateRegistry([
      { key: 'notes', kind: 'text', access: 'readWrite', initial: 'valid' },
    ]),
  );
  render(
    <FormControls>
      <BoundTextarea node={textNode} registry={registry} />
      <BoundTextarea
        node={{ ...textNode, label: 'Reader', value: { state: 'notes', mode: 'read' } }}
        registry={registry}
      />
      <BoundTextarea
        node={{ ...textNode, label: 'Protected', readOnly: true }}
        registry={registry}
      />
    </FormControls>,
  );
  fireEvent.change(screen.getByRole('textbox', { name: 'Notes' }), {
    target: { value: 'x' },
  });
  expect(success(registry.read('notes')).value).toBe('x');
  expect(screen.getByRole('textbox', { name: 'Reader' })).toHaveValue('x');
  expect(screen.getByRole('textbox', { name: 'Reader' })).toHaveAttribute('readonly');
  act(() => {
    expect(registry.update('notes', 'over budget').success).toBe(false);
  });
  expect(success(registry.read('notes')).value).toBe('x');
});

it('reports unresolved, wrong-kind and invalid current-value bindings', () => {
  const registry = success(
    createStateRegistry([
      { key: 'notes', kind: 'text', initial: 'over budget', access: 'readWrite' },
    ]),
  );
  render(
    <FormControls>
      <BoundSwitch node={switchNode} registry={registry} />
      <BoundTextarea node={textNode} registry={registry} />
    </FormControls>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  expect(screen.queryByRole('switch')).toBeNull();
  expect(screen.queryByRole('textbox')).toBeNull();
});

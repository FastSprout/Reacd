import { act, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Input } from '../../components/input/index.js';
import { SubmitButton } from '../../components/submit-button/index.js';
import { ReacdProvider } from '../provider/provider.js';
import { createStateRegistry } from '../registry/state-registry.js';
import { success } from '../../../test-support/data-table.js';
import { BoundForm } from './bound-form.js';
import type { GenerativeActions } from './generative-ui.props.js';

const node = {
  type: 'Form',
  label: 'Account',
  submitAction: 'save',
  disabled: { state: 'blocked', mode: 'read' },
  submitting: { state: 'busy', mode: 'read' },
  errors: [{ label: 'Network', message: 'Previous request failed.' }],
} as const;

it('honors capability revocation and replacement at submission time', () => {
  const registry = success(createStateRegistry([]));
  const original = vi.fn();
  const replacement = vi.fn();
  const inherited = vi.fn();
  const actions: Record<string, GenerativeActions[string]> = { save: original };
  render(
    <ReacdProvider>
      <BoundForm
        node={{ type: 'Form', label: 'Capabilities', submitAction: 'save' }}
        registry={registry}
        actions={actions}
      >
        <SubmitButton label="Submit capability" />
      </BoundForm>
    </ReacdProvider>,
  );
  const form = screen.getByRole('form', { name: 'Capabilities' });
  fireEvent.submit(form);
  expect(original.mock.calls).toEqual([[{ state: registry }]]);
  delete actions['save'];
  fireEvent.submit(form);
  expect(original).toHaveBeenCalledOnce();
  Object.setPrototypeOf(actions, { save: inherited });
  fireEvent.submit(form);
  expect(inherited).not.toHaveBeenCalled();
  actions['save'] = replacement;
  fireEvent.submit(form);
  expect(original).toHaveBeenCalledOnce();
  expect(replacement.mock.calls).toEqual([[{ state: registry }]]);
});

it('submits logical actions and follows protected state', async () => {
  const user = userEvent.setup();
  const registry = success(
    createStateRegistry([
      { key: 'blocked', kind: 'boolean', initial: false, access: 'readWrite' },
      { key: 'busy', kind: 'boolean', initial: false, access: 'readWrite' },
    ]),
  );
  const save = vi.fn();
  render(
    <ReacdProvider>
      <BoundForm node={node} registry={registry} actions={{ save }}>
        <Input
          label="Email"
          value="owner@example.com"
          onValueChange={vi.fn()}
          name="email"
          required
        />
        <SubmitButton label="Save account" />
      </BoundForm>
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Save account' }));
  expect(save.mock.calls).toEqual([[{ state: registry }]]);
  const form = screen.getByRole('form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing form');
  act(() => {
    expect(registry.update('busy', true).success).toBe(true);
  });
  expect(form).toHaveAttribute('aria-busy', 'true');
  expect([...new FormData(form)]).toEqual([['email', 'owner@example.com']]);
  fireEvent.submit(form);
  expect(save).toHaveBeenCalledTimes(1);
  act(() => {
    expect(registry.update('busy', false).success).toBe(true);
    expect(registry.update('blocked', true).success).toBe(true);
  });
  expect(screen.getByRole('textbox')).toBeDisabled();
  expect([...new FormData(form)]).toEqual([]);
  fireEvent.submit(form);
  expect(save).toHaveBeenCalledTimes(1);
});

it('reports missing capabilities and unresolved flags', () => {
  const registry = success(createStateRegistry([]));
  const save = vi.fn();
  render(
    <ReacdProvider>
      <BoundForm
        node={{ type: 'Form', label: 'Missing', submitAction: 'missing' }}
        registry={registry}
        actions={{}}
      >
        {null}
      </BoundForm>
      <BoundForm
        node={{ type: 'Form', label: 'Inherited', submitAction: 'toString' }}
        registry={registry}
        actions={{}}
      >
        {null}
      </BoundForm>
      <BoundForm node={node} registry={registry} actions={{ save }}>
        {null}
      </BoundForm>
      <BoundForm
        node={{ ...node, disabled: false }}
        registry={registry}
        actions={{ save }}
      >
        {null}
      </BoundForm>
    </ReacdProvider>,
  );
  expect(screen.getAllByRole('alert')).toHaveLength(4);
  expect(screen.queryByRole('form')).toBeNull();
});

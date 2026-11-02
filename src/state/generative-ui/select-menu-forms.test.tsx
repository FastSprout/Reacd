import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Form, ReacdProvider, SubmitButton } from '../../index.js';
import { GenerativeUI } from './generative-ui.js';
import { createStateRegistry } from '../registry/state-registry.js';

const items = [{ value: '42', label: 'Answer' }];

it.each(['single', 'multiple'])(
  'validates readonly generative mode %s through the public Form',
  async (mode) => {
    const user = userEvent.setup();
    const submit = vi.fn();
    const state = [
      {
        key: 'selected',
        kind: mode === 'single' ? 'text' : 'selection',
        initial: mode === 'single' ? '' : [],
        access: 'readWrite',
      },
    ];
    const registry = createStateRegistry(state);
    if (!registry.success) throw new Error('Missing registry.');
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <Form label="Generative record form" onSubmit={submit}>
          <GenerativeUI
            adapter={shadcnAdapter}
            document={{
              schemaVersion: '0.2',
              state,
              root: {
                type: 'SelectMenu',
                label: 'Read records',
                name: 'records',
                mode,
                items,
                required: true,
                value: { state: 'selected', mode: 'read' },
              },
            }}
            registry={registry.data}
          />
          <SubmitButton label="Save records" />
        </Form>
      </ReacdProvider>,
    );
    const form = screen.getByRole('form', { name: 'Generative record form' });
    if (!(form instanceof HTMLFormElement)) throw new Error('Missing native form.');
    const trigger = screen.getByRole('combobox', { name: 'Read records' });
    expect(trigger).toHaveAttribute('aria-readonly', 'true');
    await user.click(screen.getByRole('button', { name: 'Save records' }));
    expect(submit).not.toHaveBeenCalled();
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an option');
    act(() => {
      expect(
        registry.data.update('selected', mode === 'single' ? '42' : ['42']).success,
      ).toBe(true);
    });
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
    expect(form.checkValidity()).toBe(true);
    expect(Array.from(new FormData(form))).toEqual([['records', '42']]);
    expect(trigger).toHaveAttribute('aria-invalid', 'false');
    expect(trigger).toHaveAttribute('aria-readonly', 'true');
    await user.click(screen.getByRole('button', { name: 'Save records' }));
    await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  },
);

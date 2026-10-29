import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import {
  Form,
  FormField,
  InputMenu,
  ReacdProvider,
  SubmitButton,
} from '../../../index.js';

const items = [{ value: 'paris', label: 'Paris' }];

it('clears required feedback after a readonly host update', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  function form(value: string) {
    return (
      <ReacdProvider>
        <Form label="Shipping" onSubmit={() => undefined}>
          <InputMenu
            label="Destination"
            items={items}
            value={value}
            onValueChange={change}
            readOnly
            required
          />
          <SubmitButton label="Save shipping" />
        </Form>
      </ReacdProvider>
    );
  }
  const view = render(form(''));
  await user.click(screen.getByRole('button', { name: 'Save shipping' }));
  expect(screen.getByRole('combobox', { name: 'Destination' })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  view.rerender(form('Paris'));
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByRole('combobox', { name: 'Destination' })).not.toHaveAttribute(
    'aria-invalid',
    'true',
  );
  expect(change).not.toHaveBeenCalled();
});

it('blocks open suggestions when FormField becomes disabled', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  function field(disabled: boolean) {
    return (
      <ReacdProvider>
        <FormField name="shipping" label="Shipping field" disabled={disabled}>
          <InputMenu
            label="Destination"
            items={items}
            value=""
            onValueChange={change}
            disabled={false}
          />
        </FormField>
      </ReacdProvider>
    );
  }
  const view = render(field(false));
  await user.click(screen.getByRole('combobox', { name: 'Destination' }));
  const option = await screen.findByRole('option', { name: 'Paris' });
  view.rerender(field(true));
  expect(option).not.toBeVisible();
  expect(screen.getByRole('combobox', { name: 'Destination' })).toHaveAttribute(
    'disabled',
  );
  fireEvent.click(option);
  expect(change).not.toHaveBeenCalled();
});

it('inherits identity and required with explicit overrides', async () => {
  const user = userEvent.setup();
  const save = vi.fn();
  const view = render(
    <ReacdProvider>
      <Form label="Inherited shipping" onSubmit={save}>
        <FormField name="shipping" required help="Choose a destination.">
          <InputMenu
            label="Destination"
            items={items}
            value=""
            onValueChange={vi.fn()}
          />
        </FormField>
        <SubmitButton label="Save inherited shipping" />
      </Form>
    </ReacdProvider>,
  );
  const input = screen.getByRole('combobox', { name: 'Destination' });
  expect(input).toHaveAccessibleDescription(/Choose a destination/);
  await user.click(screen.getByRole('button', { name: 'Save inherited shipping' }));
  expect(save).not.toHaveBeenCalled();
  expect(input).toHaveFocus();
  view.rerender(
    <ReacdProvider>
      <Form label="Inherited shipping" onSubmit={save}>
        <FormField name="shipping" required>
          <InputMenu
            label="Destination"
            items={items}
            value=""
            onValueChange={vi.fn()}
            name="destination"
            required={false}
          />
        </FormField>
        <SubmitButton label="Save inherited shipping" />
      </Form>
    </ReacdProvider>,
  );
  await user.keyboard('{Escape}');
  await user.click(screen.getByRole('button', { name: 'Save inherited shipping' }));
  expect(save).toHaveBeenCalledOnce();
  const form = screen.getByRole('form', { name: 'Inherited shipping' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form.');
  expect([...new FormData(form)]).toEqual([['destination', '']]);
  expect(screen.queryByRole('alert')).toBeNull();
});

it('associates scoped errors and guidance without duplicating feedback', () => {
  render(
    <ReacdProvider>
      <FormField name="shipping" description="Field guidance" error="Host rejection">
        <InputMenu
          label="Destination"
          items={items}
          value="Paris"
          description="Input guidance"
          onValueChange={vi.fn()}
        />
      </FormField>
    </ReacdProvider>,
  );
  const input = screen.getByRole('combobox', { name: 'Destination' });
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAccessibleDescription(/Field guidance/);
  expect(input).toHaveAccessibleDescription(/Input guidance/);
  expect(input).toHaveAccessibleDescription(/Host rejection/);
  expect(screen.getAllByRole('alert')).toHaveLength(1);
  const ids = input.getAttribute('aria-describedby')?.split(' ') ?? [];
  expect(new Set(ids).size).toBe(ids.length);
});

it.each([
  { required: false, disabled: false },
  { required: true, disabled: true },
])('suspends obsolete required feedback after a host flag change %j', async (flags) => {
  const user = userEvent.setup();
  const view = render(
    <ReacdProvider>
      <Form label="Shipping flags" onSubmit={vi.fn()}>
        <InputMenu
          label="Destination"
          items={items}
          value=""
          onValueChange={vi.fn()}
          required
        />
        <SubmitButton label="Save shipping flags" />
      </Form>
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Save shipping flags' }));
  expect(screen.getByRole('alert')).toBeVisible();
  view.rerender(
    <ReacdProvider>
      <Form label="Shipping flags" onSubmit={vi.fn()}>
        <InputMenu
          label="Destination"
          items={items}
          value=""
          onValueChange={vi.fn()}
          required={flags.required}
          disabled={flags.disabled}
        />
        <SubmitButton label="Save shipping flags" />
      </Form>
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).toBeNull();
});

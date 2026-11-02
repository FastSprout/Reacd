import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { ShadcnRadioGroup } from './radio-group.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

const items = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
];

it('keeps native horizontal keyboard selection without a submitted name', async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  render(<ShadcnRadioGroup label="Choices" orientation="horizontal"
    items={items} value="one" onValueChange={change} />);
  screen.getByRole('radio', { name: 'One' }).focus();
  await user.keyboard('{ArrowRight>}');
  await waitFor(() => expect(change).toHaveBeenCalledWith('two'));
  expect(screen.getByRole('radio', { name: 'Two' })).toHaveFocus();
  await user.keyboard('{/ArrowRight}');
});

it('omits unnamed values and preserves native required selections', () => {
  const view = render(
    <form aria-label="Review">
      <ShadcnRadioGroup
        label="Choices"
        items={items}
        value="one"
        required
        onValueChange={vi.fn()}
      />
    </form>,
  );
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing test form.');
  expect(form.checkValidity()).toBe(true);
  const entries = Array.from(new FormData(form));
  expect(entries).toEqual([]);
  view.rerender(
    <form aria-label="Review">
      <ShadcnRadioGroup
        label="Choices"
        items={items}
        value=""
        required
        onValueChange={vi.fn()}
      />
    </form>,
  );
  expect(form.checkValidity()).toBe(false);
  view.rerender(
    <form aria-label="Review">
      <ShadcnRadioGroup
        label="Choices"
        items={items}
        value="two"
        required
        onValueChange={vi.fn()}
      />
    </form>,
  );
  expect(form.checkValidity()).toBe(true);
  expect(Array.from(new FormData(form))).toEqual([]);
  view.rerender(
    <form aria-label="Review">
      <ShadcnRadioGroup label="Choices" name="choice" items={items}
        value="two" required onValueChange={vi.fn()} />
    </form>,
  );
  expect(form.checkValidity()).toBe(true);
  expect(Array.from(new FormData(form))).toEqual([['choice', 'two']]);
});

it('validates SDK forms and focuses native visible radio controls', async () => {
  const save = vi.fn();
  const change = vi.fn();
  const view = render(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnRadioGroup
        label="Choices"
        items={items}
        value=""
        required
        onValueChange={change}
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).not.toHaveBeenCalled();
  await waitFor(() => expect(screen.getByRole('radio', { name: 'One' })).toHaveFocus());
  await userEvent.keyboard(' ');
  expect(change).toHaveBeenCalledWith('one');
  view.rerender(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnRadioGroup
        label="Choices"
        items={items}
        value="one"
        required
        onValueChange={change}
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(save).toHaveBeenCalledWith());
});

it('blocks controlled field errors and focuses native radio controls', async () => {
  const save = vi.fn();
  render(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnFormField name="choice" error="Choice is locked.">
        <ShadcnRadioGroup
          label="Choices"
          items={items}
          value="one"
          onValueChange={vi.fn()}
        />
      </ShadcnFormField>
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).not.toHaveBeenCalled();
  await waitFor(() => expect(screen.getByRole('radio', { name: 'One' })).toHaveFocus());
});

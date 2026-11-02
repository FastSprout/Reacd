import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiInputRating } from './input-rating.adapter.js';
import { MuiForm } from '../form/form.adapter.js';
import { MuiFormField } from '../form-field/form-field.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { UnsupportedAdapterComponentError } from
  '../../../core/unsupported-adapter-component-error.js';

function entries() {
  const form = screen.getByRole('form', { name: 'Review' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form.');
  return [...new FormData(form)];
}

it('preserves readonly canonical values without editable radios', () => {
  const change = vi.fn<(value: number) => void>();
  const view = render(
    <MuiForm label="Review" onSubmit={vi.fn()}>
      <MuiInputRating
        label="Rating"
        name="service"
        value={2.5}
        length={5}
        step={0.5}
        readOnly
        onValueChange={change}
      />
    </MuiForm>,
  );
  expect(entries()).toEqual([['service', '2.5']]);
  const form = screen.getByRole('form', { name: 'Review' });
  expect(
    form.querySelector('input[type="hidden"]')?.closest('.MuiInput-root'),
  ).toHaveStyle('display: none');
  const image = screen.getByRole('img', { name: '2.5 Stars' });
  expect(image).toBeVisible();
  expect(screen.queryByRole('radio')).toBeNull();
  fireEvent.click(image);
  fireEvent.keyDown(image, { key: 'ArrowRight' });
  expect(change).not.toHaveBeenCalled();
  expect(entries()).toEqual([['service', '2.5']]);
  view.rerender(
    <MuiForm label="Review" onSubmit={vi.fn()} submitting>
      <MuiInputRating
        label="Rating"
        name="quality"
        value={3.5}
        step={0.5}
        readOnly
        onValueChange={change}
      />
    </MuiForm>,
  );
  expect(entries()).toEqual([['quality', '3.5']]);
  expect(screen.getByRole('img', { name: '3.5 Stars' })).toBeVisible();
});

it('retains native empty values and required-zero validation', async () => {
  const submit = vi.fn<() => void>();
  render(
    <MuiForm label="Review" onSubmit={submit}>
      <MuiInputRating
        label="Rating"
        name="service"
        value={0}
        readOnly
        required
        onValueChange={vi.fn()}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  expect(entries()).toEqual([['service', '']]);
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).not.toHaveBeenCalled();
  expect(screen.getByRole('group', { name: 'Rating' })).toHaveFocus();
});

it('omits unnamed, inherited-disabled and inactive readonly canonical controls', () => {
  const view = render(
    <MuiForm label="Review" onSubmit={vi.fn()}>
      <MuiInputRating label="Rating" value={2} readOnly onValueChange={vi.fn()} />
    </MuiForm>,
  );
  expect(entries()).toEqual([]);
  view.rerender(
    <MuiForm label="Review" onSubmit={vi.fn()}>
      <MuiFormField name="service" disabled>
        <MuiInputRating
          label="Rating"
          value={2}
          readOnly
          disabled={false}
          onValueChange={vi.fn()}
        />
      </MuiFormField>
    </MuiForm>,
  );
  expect(entries()).toEqual([]);
  view.rerender(
    <MuiForm label="Review" onSubmit={vi.fn()}>
      <PortalActiveContext value={false}>
        <MuiInputRating
          label="Rating"
          name="service"
          value={2}
          readOnly
          onValueChange={vi.fn()}
        />
      </PortalActiveContext>
    </MuiForm>,
  );
  expect(entries()).toEqual([]);
});

it('preserves controlled field errors and rejects unavailable hover variants', () => {
  render(
    <MuiFormField name="service" error="Rating is locked.">
      <MuiInputRating label="Rating" value={2} readOnly onValueChange={vi.fn()} />
    </MuiFormField>,
  );
  expect(screen.getByRole('group', { name: 'Rating' })).toHaveAccessibleDescription(
    'Rating is locked.',
  );
  expect(() =>
    render(
      <MuiInputRating
        label="Rating"
        value={2}
        hoverable={false}
        onValueChange={vi.fn()}
      />,
    ),
  ).toThrow(UnsupportedAdapterComponentError);
});

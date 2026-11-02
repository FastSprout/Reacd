import { MuiCheckbox } from '../checkbox/checkbox.adapter.js';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { FieldMetadataContext } from '../../../renderer/form-field/field-metadata.js';
import { MuiInput } from '../input/input.adapter.js';
import { MuiFormField } from './form-field.adapter.js';

it('composes native fieldset metadata and linked descriptive feedback', () => {
  const view = render(
    <MuiFormField
      name="company"
      label="Company"
      required
      description="Legal name"
      hint="Registered name"
      help="Check your records"
      error="Enter the company"
      disabled
    >
      <MuiInput label="Company name" value="" onValueChange={() => undefined} />
    </MuiFormField>,
  );
  const group = screen.getByRole('group', { name: 'Company' });
  expect(group.className).toContain('MuiFormControl-root');
  const input = screen.getByRole('textbox', { name: 'Company name' });
  expect(input).toHaveAttribute('name', 'company');
  expect(input).toHaveAttribute('required');
  expect(input).toBeDisabled();
  const ids = input.getAttribute('aria-describedby')?.split(' ') ?? [];
  for (const text of ['Legal name', 'Registered name', 'Check your records']) {
    expect(ids).toContain(screen.getByText(text).id);
  }
  expect(screen.getAllByText('Enter the company')).toHaveLength(1);
  view.rerender(
    <MuiFormField name="company">
      <MuiInput label="Company name" value="" onValueChange={() => undefined} />
    </MuiFormField>,
  );
  expect(screen.getByRole('textbox', { name: 'Company name' })).not.toBeDisabled();
});

it('preserves inherited error and descriptive metadata', () => {
  render(
    <FieldMetadataContext
      value={{
        name: 'outer',
        required: true,
        disabled: false,
        error: 'Server error',
        descriptionIds: ['external-help'],
      }}
    >
      <MuiFormField name="company" label="Company">
        <MuiInput label="Company name" value="" onValueChange={() => undefined} />
      </MuiFormField>
    </FieldMetadataContext>,
  );
  expect(screen.getByRole('textbox', { name: 'Company name' })).toHaveAttribute(
    'aria-describedby',
    expect.stringContaining('external-help'),
  );
});

it('links a single owned error to native checked-state inputs', () => {
  render(
    <MuiFormField name="enabled" label="Enabled" error="Check enabled">
      <MuiCheckbox
        label="Enable project"
        checked={false}
        onCheckedChange={() => undefined}
      />
    </MuiFormField>,
  );
  const checkbox = screen.getByRole('checkbox', { name: 'Enable project' });
  const error = screen.getByText('Check enabled');
  expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  expect(checkbox.getAttribute('aria-describedby')?.split(' ')).toContain(error.id);
});

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MuiForm } from '../form/form.adapter.js';
import { MuiFormField } from './form-field.adapter.js';
import { MuiInput } from '../input/input.adapter.js';
import { MuiSelect } from '../select/select.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { focusFieldControl } from './focus-control.js';

it('skips metadata, disabled and hidden controls', async () => {
  render(
    <MuiForm label="Review" onSubmit={vi.fn()}>
      <MuiFormField name="role" error="Rejected">
        <Input type="hidden" value="metadata" />
        <Input inputProps={{ 'aria-hidden': true }} value="metadata" />
        <MuiInput label="Disabled" value="Ada" disabled onValueChange={vi.fn()} />
        <Box hidden>
          <MuiInput label="Hidden" value="Ada" onValueChange={vi.fn()} />
        </Box>
        <Box sx={{ display: 'none' }}>
          <MuiInput label="Collapsed" value="Ada" onValueChange={vi.fn()} />
        </Box>
        <Box sx={{ visibility: 'hidden' }}>
          <MuiInput label="Invisible" value="Ada" onValueChange={vi.fn()} />
        </Box>
        <MuiSelect
          label="Role"
          value="reader"
          onValueChange={vi.fn()}
          items={[{ value: 'reader', label: 'Reader' }]}
        />
      </MuiFormField>
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(screen.getByRole('combobox', { name: 'Role' })).toHaveFocus();
});

it('focuses the native fieldset without eligible controls', async () => {
  render(
    <MuiForm label="Review" onSubmit={vi.fn()}>
      <MuiFormField name="review" label="Review group" error="Rejected">
        <Input type="hidden" value="metadata" />
      </MuiFormField>
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(screen.getByRole('group', { name: 'Review group' })).toHaveFocus();
  expect(() => focusFieldControl(null)).not.toThrow();
});

it('isolates inactive fields and standalone SSR errors', async () => {
  expect(
    renderToString(
      <MuiFormField name="remote" error="Server rejected">
        <MuiInput label="Server name" value="Ada" onValueChange={vi.fn()} />
      </MuiFormField>,
    ),
  ).toContain('Server rejected');
  const submit = vi.fn<() => void>();
  render(
    <MuiForm label="Review" onSubmit={submit}>
      <PortalActiveContext value={false}>
        <MuiFormField name="inactive" error="Rejected">
          <MuiInput label="Inactive" value="Ada" onValueChange={vi.fn()} />
        </MuiFormField>
      </PortalActiveContext>
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).toHaveBeenCalledExactlyOnceWith();
  const form = screen.getByRole('form', { name: 'Review' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form.');
  expect([...new FormData(form)]).toEqual([]);
});

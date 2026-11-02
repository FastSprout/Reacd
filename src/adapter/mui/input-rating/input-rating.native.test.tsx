import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiInputRating } from './input-rating.adapter.js';
import { MuiForm } from '../form/form.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';

it('uses native Rating radios, precision and readonly image semantics', async () => {
  const change = vi.fn();
  const view = render(
    <MuiInputRating
      label="Rating"
      value={2.5}
      step={0.5}
      onValueChange={change}
      clearable
      description="Choose a value"
    />,
  );
  expect(screen.getByRole('group', { name: 'Rating' })).toBeVisible();
  fireEvent.click(screen.getByRole('radio', { name: '3 Stars' }));
  expect(change).toHaveBeenLastCalledWith(3);
  fireEvent.click(screen.getByRole('radio', { name: 'Empty' }));
  expect(change).toHaveBeenLastCalledWith(0);
  await userEvent.click(screen.getByRole('button', { name: 'Clear Rating' }));
  expect(change).toHaveBeenLastCalledWith(0);
  view.rerender(
    <MuiInputRating
      label="Rating"
      value={2}
      onValueChange={change}
      readOnly
      clearable
    />,
  );
  expect(screen.getByRole('img')).toBeVisible();
  expect(screen.queryByRole('radio')).toBeNull();
  expect(screen.getByRole('button')).toBeDisabled();
  view.rerender(
    <PortalActiveContext value={false}>
      <MuiInputRating label="Rating" value={2} onValueChange={change} />
    </PortalActiveContext>,
  );
  change.mockClear();
  fireEvent.click(screen.getByRole('radio', { name: '3 Stars' }));
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <MuiInputRating
      label="Rating"
      value={0}
      onValueChange={change}
      disabled
      clearable
    />,
  );
  expect(screen.getByRole('button')).toBeDisabled();
});

it('uses canonical required-zero validation in SDK forms', async () => {
  const save = vi.fn();
  const view = render(
    <MuiForm label="Review" onSubmit={save}>
      <MuiInputRating label="Rating" value={0} onValueChange={vi.fn()} required />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByRole('group', { name: 'Rating' })).toHaveFocus();
  view.rerender(
    <MuiForm label="Review" onSubmit={save}>
      <MuiInputRating label="Rating" value={2} onValueChange={vi.fn()} required />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(save).toHaveBeenCalledWith();
});

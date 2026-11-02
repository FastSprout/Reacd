import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnInputRating } from './input-rating.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it('uses the native scalar Slider with half steps and clear requests', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnInputRating
      label="Rating"
      value={2.5}
      step={0.5}
      onValueChange={change}
      clearable
      description="Choose a value"
    />,
  );
  const slider = screen.getByRole('slider', { name: 'Rating' });
  expect(slider).toHaveAttribute('data-slot', 'slider-thumb');
  expect(slider).toHaveAttribute('aria-valuetext', '2.5 of 5 stars');
  slider.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(change).toHaveBeenLastCalledWith(3);
  await userEvent.click(screen.getByRole('button', { name: 'Clear Rating' }));
  expect(change).toHaveBeenLastCalledWith(0);
  view.rerender(
    <ShadcnInputRating
      label="Rating"
      value={2}
      onValueChange={change}
      readOnly
      clearable
    />,
  );
  screen.getByRole('slider').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(change).toHaveBeenCalledTimes(2);
  expect(screen.getByRole('button')).toBeDisabled();
  view.rerender(
    <ShadcnInputRating
      label="Rating"
      value={0}
      onValueChange={change}
      disabled
      clearable
    />,
  );
  expect(screen.getByRole('button')).toBeDisabled();
});

it('uses SDK FormField validation and its native thumb focus handle', async () => {
  const save = vi.fn();
  const change = vi.fn();
  const view = render(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnInputRating
        label="Rating"
        value={0}
        onValueChange={change}
        required
        name="quality"
      />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByText('Choose a rating.')).toBeVisible();
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByRole('slider')).toHaveFocus();
  fireEvent.blur(screen.getByRole('slider'));
  view.rerender(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnInputRating label="Rating" value={2} onValueChange={change} required />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  screen.getByRole('slider').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(change).toHaveBeenCalledWith(3);
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(save).toHaveBeenCalledWith());
  view.rerender(
    <ShadcnForm label="Review" onSubmit={save}>
      <ShadcnInputRating label="Rating" value={0} onValueChange={change} />
      <ShadcnSubmitButton label="Save" />
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(save).toHaveBeenCalledTimes(2));
});

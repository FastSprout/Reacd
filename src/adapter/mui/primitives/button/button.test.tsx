import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiButtonPrimitive } from './button.js';

it.each(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const)(
  'renders the %s intent through Material UI',
  (variant) => {
    render(<MuiButtonPrimitive variant={variant}>Continue</MuiButtonPrimitive>);
    expect(screen.getByRole('button', { name: 'Continue' }).className).toContain(
      'MuiButton-root',
    );
  },
);

it.each(['default', 'sm', 'lg', 'icon', null, undefined] as const)(
  'supports the private %s size without exposing styling to the application',
  (size) => {
    render(<MuiButtonPrimitive size={size}>Continue</MuiButtonPrimitive>);
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  },
);

it('preserves native events, disabled behavior and button refs', async () => {
  const user = userEvent.setup();
  const click = vi.fn();
  const ref = vi.fn();
  const view = render(
    <MuiButtonPrimitive ref={ref} onClick={click}>
      Save
    </MuiButtonPrimitive>,
  );
  const control = screen.getByRole('button', { name: 'Save' });
  expect(ref).toHaveBeenCalledWith(control);
  await user.click(control);
  expect(click).toHaveBeenCalledOnce();
  view.rerender(
    <>
      <MuiButtonPrimitive disabled onClick={click}>
        Save
      </MuiButtonPrimitive>
      <button>Another action</button>
    </>,
  );
  const disabled = screen.getByRole('button', { name: 'Save' });
  expect(disabled).toBeDisabled();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Another action' })).toHaveFocus();
  fireEvent.click(disabled);
  expect(click).toHaveBeenCalledOnce();
});

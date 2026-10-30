import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SliderExample } from './slider.js';

const CONTROL_WIDTH = 200;
const CONTROL_HEIGHT = 44;

it('runs controlled slider edits, save, protection and RTL examples', async () => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => new DOMRect(0, 0, CONTROL_WIDTH, CONTROL_HEIGHT),
  );
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <SliderExample />
    </ReacdProvider>,
  );
  const output = await screen.findByRole('slider', { name: 'Output level' });
  act(() => output.focus());
  await user.keyboard('{ArrowRight}');
  expect(output).toHaveAttribute('aria-valuenow', '21');
  const minimum = screen.getByRole('slider', { name: 'Minimum Price interval' });
  act(() => minimum.focus());
  await user.keyboard('{ArrowRight}');
  expect(minimum).toHaveAttribute('aria-valuenow', '21');
  await user.click(screen.getByRole('button', { name: 'Save sliders' }));
  expect(screen.getByText('Sliders saved.')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Read-only sliders' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left sliders' }));
  expect(output).toHaveAttribute('aria-readonly', 'true');
  await user.click(screen.getByRole('switch', { name: 'Disable sliders' }));
  expect(output).toBeDisabled();
});

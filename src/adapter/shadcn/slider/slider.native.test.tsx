import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnSlider } from './slider.adapter.js';

it('delegates numeric keyboard edits to SDK slider thumbs', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnSlider label="Volume" value={5} min={0} max={10} onValueChange={change} />,
  );
  const slider = screen.getByRole('slider', { name: 'Volume' });
  expect(slider).toHaveAttribute('data-slot', 'slider-thumb');
  slider.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(change).toHaveBeenCalledWith(6);
  change.mockClear();
  view.rerender(
    <ShadcnSlider
      label="Volume"
      mode="range"
      value={{ start: 2, end: 8 }}
      min={0}
      max={10}
      onValueChange={change}
      description="Allowed range"
    />,
  );
  screen.getByRole('slider', { name: 'Minimum Volume' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(change).toHaveBeenCalledWith({ start: 3, end: 8 });
  change.mockClear();
  view.rerender(
    <ShadcnSlider
      label="Volume"
      value={5}
      min={0}
      max={10}
      onValueChange={change}
      readOnly
    />,
  );
  screen.getByRole('slider', { name: 'Volume' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(change).not.toHaveBeenCalled();
});

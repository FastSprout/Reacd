import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { useState } from 'react';
import { ShadcnSlider } from './slider.adapter.js';

it('uses native endpoint names and unique semantic thumb metadata', () => {
  const view = render(
    <form>
      <ShadcnSlider
        mode="range"
        label="Price"
        name="price"
        value={{ start: 2, end: 8 }}
        min={0}
        max={10}
        onValueChange={vi.fn()}
        description="Allowed range"
        readOnly
      />
    </form>,
  );
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing test form.');
  expect(Array.from(new FormData(form))).toEqual([
    ['price.start', '2'],
    ['price.end', '8'],
  ]);
  const minimum = screen.getByRole('slider', { name: 'Minimum Price' });
  expect(minimum).toHaveAttribute('aria-readonly', 'true');
  expect(minimum).toHaveAccessibleDescription('Allowed range');
  expect(screen.getByRole('slider', { name: 'Maximum Price' })).toBeVisible();
});

it('lets the native SDK prevent crossing an adjacent range thumb', async () => {
  const change = vi.fn();
  function Sample() {
    const [value, setValue] = useState({ start: 7, end: 8 });
    return (
      <ShadcnSlider
        mode="range"
        label="Price"
        value={value}
        min={0}
        max={10}
        onValueChange={(next) => {
          change(next);
          setValue(next);
        }}
      />
    );
  }
  render(<Sample />);
  screen.getByRole('slider', { name: 'Minimum Price' }).focus();
  await userEvent.keyboard('{ArrowRight}{ArrowRight}');
  expect(change).toHaveBeenCalledExactlyOnceWith({ start: 8, end: 8 });
});

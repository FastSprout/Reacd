import { MuiForm } from '../form/form.adapter.js';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { MuiSlider } from './slider.adapter.js';
it('uses Material Slider for scalar values', () => {
  const change = vi.fn<(value: number) => void>();
  render(
    <MuiSlider label="Volume" value={20} min={0} max={100} onValueChange={change} />,
  );
  const slider = screen.getByRole('slider', { name: 'Volume' });
  expect(slider.closest('.MuiSlider-root')).not.toBeNull();
  fireEvent.change(slider, { target: { value: '30' } });
  expect(change).toHaveBeenCalledWith(30);
});
it('maps the Material range back to a logical interval', () => {
  const change = vi.fn<(value: { start: number; end: number }) => void>();
  render(
    <MuiSlider
      label="Range"
      mode="range"
      value={{ start: 20, end: 80 }}
      min={0}
      max={100}
      onValueChange={change}
    />,
  );
  fireEvent.change(screen.getByRole('slider', { name: 'Range Minimum' }), {
    target: { value: '30' },
  });
  expect(change).toHaveBeenCalledWith({ start: 30, end: 80 });
});

it('allocates the declared vertical extent using the native Slider API', () => {
  render(
    <MuiSlider
      label="Level"
      value={2}
      min={0}
      max={10}
      orientation="vertical"
      onValueChange={() => undefined}
    />,
  );
  const slider = screen.getByRole('slider', { name: 'Level' });
  expect(slider).toHaveAttribute('aria-orientation', 'vertical');
  expect(slider.closest('.MuiSlider-root')).toHaveStyle('height: 192px');
});

it('serializes the actual SDK range inputs with canonical endpoint names', () => {
  const view = render(
    <MuiForm label="Price" onSubmit={() => undefined}>
      <MuiSlider
        label="Range"
        name="price"
        mode="range"
        min={0}
        max={100}
        value={{ start: 20, end: 80 }}
        onValueChange={() => undefined}
      />
    </MuiForm>,
  );
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Expected native form');
  expect([...new FormData(form).entries()]).toEqual([
    ['price.start', '20'],
    ['price.end', '80'],
  ]);
});

it('retains off-grid controlled values in native inputs until an SDK edit', () => {
  const view = render(
    <MuiForm label="Amount" onSubmit={() => undefined}>
      <MuiSlider
        label="Value"
        name="amount"
        min={0}
        max={10}
        step={1}
        value={1.5}
        onValueChange={() => undefined}
      />
    </MuiForm>,
  );
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Expected native form');
  expect(new FormData(form).get('amount')).toBe('1.5');
});

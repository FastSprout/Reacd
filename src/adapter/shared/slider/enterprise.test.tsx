import { act, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { DirectionProvider } from '@radix-ui/react-direction';
import { beforeEach, expect, it, vi } from 'vitest';
import { SharedSlider } from './slider.adapter.js';
import { SharedFormField } from '../form-field/form-field.adapter.js';

const CONTROL_WIDTH = 200;
const CONTROL_HEIGHT = 44;

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    () => new DOMRect(0, 0, CONTROL_WIDTH, CONTROL_HEIGHT),
  );
});

it('requests exact numbers and retains declined host values', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { rerender } = render(
    <SharedSlider label="Level" value={20} min={0} max={100} onValueChange={change} />,
  );
  const thumb = await screen.findByRole('slider', { name: 'Level' });
  act(() => thumb.focus());
  await user.keyboard('{ArrowRight}');
  expect(change.mock.calls).toEqual([[21]]);
  expect(thumb).toHaveAttribute('aria-valuenow', '20');
  rerender(
    <SharedSlider
      label="Level"
      value={21}
      min={0}
      max={100}
      step={2}
      onValueChange={change}
    />,
  );
  await user.keyboard('{PageUp}{Home}{End}');
  expect(change.mock.calls).toEqual([[21], [42], [0], [100]]);
});

it('keeps range endpoint identity and returns one frozen DTO', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <SharedSlider
      mode="range"
      label="Price"
      value={{ start: 20, end: 80 }}
      min={0}
      max={100}
      onValueChange={change}
    />,
  );
  const minimum = await screen.findByRole('slider', { name: 'Minimum Price' });
  const maximum = screen.getByRole('slider', { name: 'Maximum Price' });
  act(() => minimum.focus());
  await user.keyboard('{ArrowRight}{End}');
  expect(change.mock.calls).toEqual([
    [{ start: 21, end: 80 }],
    [{ start: 80, end: 80 }],
  ]);
  expect(Object.isFrozen(change.mock.calls[0]?.[0])).toBe(true);
  act(() => maximum.focus());
  await user.keyboard('{Home}');
  expect(change.mock.calls[2]).toEqual([{ start: 20, end: 20 }]);
  expect(minimum).toHaveAttribute('aria-valuenow', '20');
  expect(maximum).toHaveAttribute('aria-valuenow', '80');
});

it('bridges RTL and vertical direction without exposing DOM props', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <DirectionProvider dir="rtl">
      <SharedSlider
        label="Vertical"
        value={20}
        min={0}
        max={100}
        orientation="vertical"
        onValueChange={change}
      />
      <SharedSlider label="RTL" value={20} min={0} max={100} onValueChange={change} />
    </DirectionProvider>,
  );
  const vertical = await screen.findByRole('slider', { name: 'Vertical' });
  expect(vertical).toHaveAttribute('aria-orientation', 'vertical');
  act(() => vertical.focus());
  await user.keyboard('{ArrowUp}');
  const horizontal = screen.getByRole('slider', { name: 'RTL' });
  act(() => horizontal.focus());
  await user.keyboard('{ArrowRight}');
  expect(change.mock.calls).toEqual([[21], [19]]);
});

it('keeps readonly data and inherits disabled field metadata', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const { container, rerender } = render(
    <form>
      <SharedFormField name="price" description="Budget" error="Check interval">
        <SharedSlider
          mode="range"
          label="Price"
          value={{ start: 20, end: 80 }}
          min={0}
          max={100}
          description="Inclusive endpoints"
          readOnly
          onValueChange={change}
        />
      </SharedFormField>
    </form>,
  );
  const form = container.querySelector('form');
  if (form === null) throw new Error('Expected form.');
  const minimum = await screen.findByRole('slider', { name: 'Minimum Price' });
  expect(minimum).toHaveAttribute('aria-readonly', 'true');
  expect(minimum).toHaveAccessibleDescription(
    'Budget Check interval Inclusive endpoints',
  );
  act(() => minimum.focus());
  await user.keyboard('{End}');
  expect(change).not.toHaveBeenCalled();
  expect([...new FormData(form)]).toEqual([
    ['price.start', '20'],
    ['price.end', '80'],
  ]);
  rerender(
    <form>
      <SharedFormField name="level" disabled>
        <SharedSlider
          label="Level"
          value={25}
          min={0}
          max={100}
          disabled={false}
          onValueChange={change}
        />
      </SharedFormField>
    </form>,
  );
  expect(screen.getByRole('slider')).toBeDisabled();
  expect([...new FormData(form)]).toEqual([]);
});

it('updates exact native input semantics when readonly and error change', async () => {
  const { rerender } = render(
    <SharedFormField name="reactive" error="Invalid interval">
      <SharedSlider
        label="Reactive"
        value={20}
        min={0}
        max={100}
        readOnly
        onValueChange={vi.fn()}
      />
    </SharedFormField>,
  );
  const thumb = await screen.findByRole('slider', { name: 'Reactive' });
  expect(thumb).toHaveAttribute('aria-readonly', 'true');
  expect(thumb).toHaveAttribute('aria-invalid', 'true');
  rerender(
    <SharedFormField name="reactive">
      <SharedSlider
        label="Reactive"
        value={20}
        min={0}
        max={100}
        onValueChange={vi.fn()}
      />
    </SharedFormField>,
  );
  expect(thumb).not.toHaveAttribute('aria-readonly');
  expect(thumb).not.toHaveAttribute('aria-invalid');
});

import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ShadcnInputRating } from './input-rating.adapter.js';
import { DirectionProvider } from '@radix-ui/react-direction';

describe('shadcn InputRating', () => {
  it('mirrors hover previews and keyboard selection in RTL', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { container } = render(
      <DirectionProvider dir="rtl">
        <ShadcnInputRating label="Quality" value={3} onValueChange={change} hoverable />
      </DirectionProvider>,
    );
    const control = container.querySelector('.reacd-rating-control');
    if (control === null) throw new Error('Expected rating control');
    vi.spyOn(control, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(0, 0, 250, 44),
    );
    fireEvent.pointerMove(control, { clientX: 150 });
    expect(container.querySelectorAll('.reacd-rating-star-fill')).toHaveLength(2);
    const slider = screen.getByRole('slider', { name: 'Quality' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(change).toHaveBeenLastCalledWith(2);
  });
  it('supports half-step keyboard changes, bounds, and explicit clearing', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Example() {
      const [value, setValue] = useState(2.5);
      return (
        <ShadcnInputRating
          label="Quality"
          description="Rate the service"
          value={value}
          step={0.5}
          length={5}
          clearable
          name="quality"
          onValueChange={(next) => {
            change(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Example />);
    const slider = screen.getByRole('slider', { name: 'Quality' });
    expect(slider).toHaveAccessibleDescription('Rate the service');
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(change).toHaveBeenLastCalledWith(3);
    await user.keyboard('{End}');
    expect(change).toHaveBeenLastCalledWith(5);
    await user.keyboard('{Home}');
    expect(change).toHaveBeenLastCalledWith(0);
    expect(screen.getByRole('button', { name: 'Clear Quality' })).toBeDisabled();
    await user.keyboard('{ArrowRight}');
    await user.click(screen.getByRole('button', { name: 'Clear Quality' }));
    expect(slider).toHaveAttribute('aria-valuetext', '0 of 5 stars');
  });
  it('previews on hover without committing and resets on leave', () => {
    const change = vi.fn();
    const { container } = render(
      <ShadcnInputRating label="Quality" value={1} onValueChange={change} hoverable />,
    );
    const control = container.querySelector('.reacd-rating-control');
    if (control === null) throw new Error('Expected rating control');
    fireEvent.pointerMove(control, { clientX: 150 });
    vi.spyOn(control, 'getBoundingClientRect').mockReturnValue(
      new DOMRect(0, 0, 250, 44),
    );
    fireEvent.pointerMove(control, { clientX: 150 });
    expect(container.querySelectorAll('.reacd-rating-star-fill')).toHaveLength(3);
    expect(change).not.toHaveBeenCalled();
    fireEvent.pointerLeave(control);
    expect(container.querySelectorAll('.reacd-rating-star-fill')).toHaveLength(1);
  });
  it('keeps host state controlled when writes are rejected', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<ShadcnInputRating label="Fixed" value={1} onValueChange={change} />);
    const slider = screen.getByRole('slider', { name: 'Fixed' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    expect(change).toHaveBeenCalledWith(2);
    expect(slider).toHaveAttribute('aria-valuenow', '1');
  });
  it.each([
    { disabled: true, hoverable: true },
    { readOnly: true, hoverable: true },
    { hoverable: false },
  ])('respects preview/interaction protection: %j', (properties) => {
    const change = vi.fn();
    const { container } = render(
      <ShadcnInputRating
        {...properties}
        label="Quality"
        value={2}
        onValueChange={change}
        clearable
      />,
    );
    const control = container.querySelector('.reacd-rating-control');
    if (control === null) throw new Error('Expected rating control');
    fireEvent.pointerMove(control, { clientX: 150 });
    expect(container.querySelectorAll('.reacd-rating-star-fill')).toHaveLength(2);
    expect(change).not.toHaveBeenCalled();
  });
  it('blocks required empty submission and focuses the visible slider', async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    function Example() {
      const [value, setValue] = useState(0);
      return (
        <form onSubmit={submit}>
          <ShadcnInputRating
            label="Quality"
            value={value}
            onValueChange={setValue}
            required
            name="quality"
          />
          <button type="submit">Submit</button>
        </form>
      );
    }
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(submit).not.toHaveBeenCalled();
    const slider = screen.getByRole('slider', { name: 'Quality' });
    expect(slider).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(submit).toHaveBeenCalledOnce();
  });
});

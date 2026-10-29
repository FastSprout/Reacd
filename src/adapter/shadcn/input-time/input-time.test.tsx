import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DirectionProvider } from '@radix-ui/react-direction';
import { describe, expect, it, vi } from 'vitest';
import { ShadcnInputTime } from './input-time.adapter.js';

describe('segmented InputTime', () => {
  it('edits canonical time, respects the host and clears values', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender } = render(
      <ShadcnInputTime
        label="Arrival"
        description="Local arrival time"
        value="12:30:45"
        onValueChange={change}
      />,
    );
    const hour = screen.getByRole('spinbutton', { name: /hour, Arrival/i });
    expect(hour).toHaveAccessibleDescription(/Local arrival time/);
    hour.focus();
    await user.keyboard('{ArrowUp}');
    expect(change).toHaveBeenLastCalledWith('13:30:45');
    expect(hour).toHaveAttribute('aria-valuenow', '12');
    rerender(
      <ShadcnInputTime label="Arrival" value="13:30:45" onValueChange={change} />,
    );
    await user.click(screen.getByRole('button', { name: 'Clear Arrival' }));
    expect(change).toHaveBeenLastCalledWith(null);
    rerender(<ShadcnInputTime label="Arrival" value={null} onValueChange={change} />);
    expect(
      screen.getByRole('spinbutton', { name: /hour, Arrival/i }),
    ).not.toHaveAttribute('aria-valuenow');
    await user.click(screen.getByRole('button', { name: 'Clear Arrival' }));
    expect(change).toHaveBeenLastCalledWith(null);
  });

  it('requests ordered ranges and announces rejected endpoints', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Example() {
      const [value, setValue] = useState<
        Readonly<{ start: string | null; end: string | null }>
      >({ start: '12:00:00', end: '12:00:00' });
      return (
        <ShadcnInputTime
          mode="range"
          label="Opening hours"
          min="09:00:00"
          max="17:00:00"
          name="hours"
          value={value}
          onValueChange={(next) => {
            setValue(next);
            change(next);
          }}
        />
      );
    }
    render(<Example />);
    const start = screen.getByRole('spinbutton', {
      name: /hour, Start Opening hours/i,
    });
    start.focus();
    await user.keyboard('{ArrowUp}');
    expect(change).not.toHaveBeenCalled();
    expect(screen.getAllByText(/Time range must be ordered/).length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: 'Clear End Opening hours' }));
    expect(change).toHaveBeenLastCalledWith({ start: '12:00:00', end: null });
    await user.click(screen.getByRole('button', { name: 'Clear Start Opening hours' }));
    expect(change).toHaveBeenLastCalledWith({ start: null, end: null });
  });

  it.each([{ disabled: true }, { readOnly: true }])(
    'prevents protected endpoint writes: %j',
    async (protection) => {
      const user = userEvent.setup();
      const change = vi.fn();
      render(
        <ShadcnInputTime
          {...protection}
          label="Protected time"
          value="12:00:00"
          onValueChange={change}
        />,
      );
      const hour = screen.getByRole('spinbutton', { name: /hour, Protected time/i });
      fireEvent.keyDown(hour, { key: 'ArrowUp' });
      await user.click(screen.getByRole('button', { name: 'Clear Protected time' }));
      expect(change).not.toHaveBeenCalled();
    },
  );

  it('preserves App outer RTL and explicit locale numeric ordering', () => {
    const { container, rerender } = render(
      <DirectionProvider dir="rtl">
        <ShadcnInputTime label="Locale time" value={null} onValueChange={vi.fn()} />
      </DirectionProvider>,
    );
    expect(container.querySelector('.reacd-input-time')).toHaveAttribute('dir', 'rtl');
    expect(container.querySelector('.reacd-time-segments')).toHaveAttribute(
      'dir',
      'ltr',
    );
    rerender(
      <DirectionProvider dir="rtl">
        <ShadcnInputTime
          label="Locale time"
          locale="ar-EG"
          value="12:30:00"
          onValueChange={vi.fn()}
        />
      </DirectionProvider>,
    );
    expect(container.querySelector('.reacd-time-segments')).toHaveAttribute(
      'dir',
      'rtl',
    );
  });
});

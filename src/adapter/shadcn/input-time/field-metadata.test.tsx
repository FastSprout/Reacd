import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';
import { ShadcnInputTime } from './input-time.adapter.js';

it('blocks disabled edits and omits canonical native data', async () => {
  const change = vi.fn();
  const user = userEvent.setup();
  const { container, rerender } = render(
    <form>
      <ShadcnFormField name="inherited" disabled>
        <ShadcnInputTime
          label="Scoped value"
          value="12:30:00"
          disabled={false}
          onValueChange={change}
        />
      </ShadcnFormField>
    </form>,
  );
  const segment = screen.getByRole('spinbutton', { name: /hour, Scoped value/i });
  expect(segment).toHaveAttribute('aria-disabled', 'true');
  expect(segment).not.toHaveAttribute('contenteditable', 'true');
  segment.focus();
  await user.keyboard('{ArrowUp}');
  expect(change).not.toHaveBeenCalled();
  const form = container.querySelector('form');
  if (!form) throw new Error('Expected the scoped native form.');
  expect([...new FormData(form)]).toEqual([]);
  rerender(
    <form>
      <ShadcnFormField name="inherited" disabled>
        <ShadcnInputTime label="Scoped value" value="14:00:00" onValueChange={change} />
      </ShadcnFormField>
    </form>,
  );
  expect(container.querySelector('input[name="inherited"]')).toHaveValue('14:00:00');
  expect(change).not.toHaveBeenCalled();
});

it('inherits range names and required defaults but honors explicit overrides', () => {
  const { container, rerender } = render(
    <form>
      <ShadcnFormField name="schedule" required>
        <ShadcnInputTime
          label="Scoped range"
          mode="range"
          value={{ start: '12:30:00', end: '14:00:00' }}
          onValueChange={vi.fn()}
        />
      </ShadcnFormField>
    </form>,
  );
  const form = container.querySelector('form');
  if (!form) throw new Error('Expected the scoped native form.');
  expect(Object.fromEntries(new FormData(form))).toEqual({
    'schedule.start': '12:30:00',
    'schedule.end': '14:00:00',
  });
  const start = screen.getByRole('spinbutton', { name: /hour, Start Scoped range/i });
  expect(start).toHaveAttribute('aria-required', 'true');
  rerender(
    <form>
      <ShadcnFormField name="schedule" required>
        <ShadcnInputTime
          label="Scoped range"
          mode="range"
          name="override"
          required={false}
          value={{ start: '12:30:00', end: '14:00:00' }}
          onValueChange={vi.fn()}
        />
      </ShadcnFormField>
    </form>,
  );
  expect(Object.fromEntries(new FormData(form))).toEqual({
    'override.start': '12:30:00',
    'override.end': '14:00:00',
  });
  expect(start).not.toHaveAttribute('aria-required', 'true');
});

it('associates scope feedback and own description without duplicating errors', () => {
  const change = vi.fn();
  const { container, rerender } = render(
    <ShadcnFormField name="schedule" description="Scope guidance" error="Unavailable">
      <ShadcnInputTime
        label="Described value"
        description="Endpoint guidance"
        value="12:30:00"
        onValueChange={change}
      />
    </ShadcnFormField>,
  );
  const segment = screen.getByRole('spinbutton', { name: /hour, Described value/i });
  expect(segment).toHaveAttribute('aria-invalid', 'true');
  expect(segment).toHaveAccessibleDescription(/Scope guidance/);
  expect(segment).toHaveAccessibleDescription(/Unavailable/);
  expect(segment).toHaveAccessibleDescription(/Endpoint guidance/);
  expect(screen.getAllByText('Unavailable')).toHaveLength(1);
  const input = container.querySelector('input[name="schedule"]');
  rerender(
    <ShadcnFormField name="schedule" description="Scope guidance" error="">
      <ShadcnInputTime
        label="Described value"
        description="Endpoint guidance"
        value="12:30:00"
        onValueChange={change}
      />
    </ShadcnFormField>,
  );
  expect(container.querySelector('input[name="schedule"]')).toBe(input);
  expect(segment).not.toHaveAttribute('aria-invalid', 'true');
  expect(segment).toHaveAccessibleDescription(/Scope guidance/);
  expect(change).not.toHaveBeenCalled();
});

import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiInputDate } from './input-date.adapter.js';
import { MuiForm } from '../form/form.adapter.js';
import { MuiSubmitButton } from '../submit-button/submit-button.adapter.js';
import { FormPendingContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/form/interaction-context.js';
import { PortalActiveContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';

it('validates required readonly dates and focuses native sections', () => {
  const save = vi.fn();
  const view = render(
    <MuiForm label="Order" onSubmit={save}>
      <MuiInputDate
        label="Delivery"
        value={null}
        referenceDate="2026-11-01"
        required
        readOnly
        onValueChange={vi.fn()}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  fireEvent.submit(screen.getByRole('form'));
  expect(save).not.toHaveBeenCalled();
  expect(screen.getByRole('spinbutton', { name: 'Month' })).toHaveFocus();
  view.rerender(
    <MuiForm label="Order" onSubmit={save}>
      <MuiInputDate
        label="Delivery"
        value="2026-11-16"
        referenceDate="2026-11-01"
        required
        readOnly
        onValueChange={vi.fn()}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  fireEvent.submit(screen.getByRole('form'));
  expect(save).toHaveBeenCalledWith();
});

it('preserves pending form data and prevents popup/changes', () => {
  const change = vi.fn();
  const field = (
    <MuiInputDate
      label="Delivery"
      name="delivery"
      value="2026-11-16"
      referenceDate="2026-11-01"
      onValueChange={change}
    />
  );
  const view = render(
    <form aria-label="Order">
      <FormPendingContext value={true}>{field}</FormPendingContext>
    </form>,
  );
  const form = screen.getByRole('form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected form');
  expect(new FormData(form).get('delivery')).toBe('2026-11-16');
  const input = form.querySelector('input[name="delivery"]');
  if (!(input instanceof HTMLInputElement)) throw new Error('Expected input');
  fireEvent.change(input, { target: { value: '11/17/2026' } });
  fireEvent.click(screen.getByRole('button', { name: /Choose date/ }));
  expect(screen.queryByRole('dialog')).toBeNull();
  fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'Day' }), {
    key: 'ArrowUp',
  });
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <form aria-label="Order">
      <PortalActiveContext value={false}>{field}</PortalActiveContext>
    </form>,
  );
  expect(new FormData(form).has('delivery')).toBe(false);
  view.rerender(
    <form aria-label="Order">
      <MuiInputDate
        label="Delivery"
        disabled
        name="delivery"
        value={null}
        referenceDate="2026-11-01"
        onValueChange={change}
      />
    </form>,
  );
  expect(new FormData(form).has('delivery')).toBe(false);
});

it('rejects invalid native drafts on submission and change', async () => {
  const change = vi.fn();
  const save = vi.fn();
  render(
    <MuiForm label="Order" onSubmit={save}>
      <MuiInputDate
        label="Delivery"
        value="2026-11-16"
        referenceDate="2026-11-01"
        onValueChange={change}
      />
      <MuiSubmitButton label="Save" />
    </MuiForm>,
  );
  await userEvent.click(screen.getByRole('spinbutton', { name: 'Day' }));
  await userEvent.keyboard('31');
  expect(change).not.toHaveBeenCalledWith('2026-11-31');
  fireEvent.submit(screen.getByRole('form'));
  expect(save).not.toHaveBeenCalled();
  expect(
    screen.getAllByText('Date must be within its allowed limits.').length,
  ).toBeGreaterThan(0);
});

it('focuses required readonly sections after desktop submit', async () => {
  const media = vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: query.includes('pointer: fine'),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  const save = vi.fn();
  try {
    render(
      <MuiForm label="Review" onSubmit={save}>
        <MuiInputDate
          label="Event"
          value={null}
          required
          readOnly
          referenceDate="2024-02-28"
          onValueChange={vi.fn()}
        />
        <MuiSubmitButton label="Save event" />
      </MuiForm>,
    );
    const month = screen.getByRole('spinbutton', { name: 'Month' });
    await userEvent.click(screen.getByRole('button', { name: 'Save event' }));
    expect(save).not.toHaveBeenCalled();
    expect(month).toHaveFocus();
  } finally {
    media.mockRestore();
  }
});

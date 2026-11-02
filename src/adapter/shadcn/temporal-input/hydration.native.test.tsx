import { act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { ShadcnInputDate } from '../input-date/input-date.adapter.js';
import { ShadcnInputTime } from '../input-time/input-time.adapter.js';

it('hydrates explicit Gregorian date and local time SDK segments', async () => {
  const value = (
    <>
      <ShadcnInputDate
        label="Date"
        referenceDate="0099-01-05"
        value="0099-01-05"
        name="date"
        locale="ar-SA-u-ca-islamic"
        onValueChange={vi.fn()}
      />
      <ShadcnInputTime
        label="Time"
        value="23:59:59"
        name="time"
        locale="en-US"
        onValueChange={vi.fn()}
      />
    </>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(value);
  document.body.append(container);
  const segment = container.querySelector('[role="spinbutton"]');
  const errors = vi.fn();
  const root = hydrateRoot(container, value, { onRecoverableError: errors });
  await act(async () => {});
  expect(container.querySelector('[role="spinbutton"]')).toBe(segment);
  expect(container.querySelector('input[name="date"]')).toHaveAttribute(
    'value',
    '0099-01-05',
  );
  expect(container.querySelector('input[name="time"]')).toHaveAttribute(
    'value',
    '23:59:59',
  );
  expect(errors).not.toHaveBeenCalled();
  await act(async () => root.unmount());
  container.remove();
});

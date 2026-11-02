import { act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { ShadcnCalendar } from './calendar.adapter.js';

it('hydrates explicit Gregorian dates without ambient markers', async () => {
  const value = (
    <ShadcnCalendar
      label="Historical day"
      referenceDate="0099-01-05"
      value="0099-01-05"
      onValueChange={vi.fn()}
      locale="ar-SA-u-ca-islamic"
    />
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(value);
  document.body.append(container);
  const day = container.querySelector('[data-day="0099-01-05"]');
  const errors = vi.fn();
  const root = hydrateRoot(container, value, { onRecoverableError: errors });
  await act(async () => {});
  expect(container.querySelector('[data-day="0099-01-05"]')).toBe(day);
  expect(errors).not.toHaveBeenCalled();
  await act(async () => root.unmount());
  container.remove();
});

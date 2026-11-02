import { render, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { InstallationExample } from './installation-mui.js';

it('isolates installed browser views with interactive local state', async () => {
  const user = userEvent.setup();
  const first = within(render(<InstallationExample />).container);
  const second = within(render(<InstallationExample />).container);
  expect(first.getByText('Email summaries are disabled.')).toBeVisible();
  expect(second.getByText('Email summaries are disabled.')).toBeVisible();
  const toggle = first.getByRole('switch', { name: 'Email summaries' });
  if (!(toggle instanceof HTMLInputElement)) throw new Error('Missing switch input.');
  await user.click(toggle);
  expect(toggle.checked).toBe(true);
  expect(first.getByText('Email summaries are enabled.')).toBeVisible();
  expect(second.getByText('Email summaries are disabled.')).toBeVisible();
  await user.click(toggle);
  expect(toggle.checked).toBe(false);
  expect(first.getByText('Email summaries are disabled.')).toBeVisible();
});

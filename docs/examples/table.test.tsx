import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../src/index.js';
import { TableExample } from './table.js';
it('runs controlled transitions, protected states and rejection', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <TableExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 2 of 3');
  await user.click(screen.getByRole('button', { name: 'Sort Amount' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
  await user.click(screen.getByRole('switch', { name: 'Reject table proposals' }));
  await user.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('status')).toHaveTextContent('Page 1 of 3');
  await user.click(screen.getByRole('switch', { name: 'Reject table proposals' }));
  for (const label of [
    'Readonly table',
    'Disabled table',
    'Right to left table',
    'Empty table preview',
  ]) {
    await user.click(screen.getByRole('switch', { name: label }));
    await user.click(screen.getByRole('switch', { name: label }));
  }
  await user.type(screen.getByRole('textbox', { name: 'Table caption' }), ' updated');
  await user.clear(screen.getByRole('textbox', { name: 'Table caption' }));
  await user.click(screen.getByRole('button', { name: 'Preview loading table' }));
  expect(screen.getByRole('status')).toHaveTextContent('Loading data');
  await user.click(screen.getByRole('button', { name: 'Preview failed table' }));
  await user.click(screen.getByRole('button', { name: 'Retry table' }));
  await user.click(screen.getByRole('button', { name: 'Restore table data' }));
  expect(screen.getByRole('table', { name: 'Reference orders' })).toBeVisible();
});

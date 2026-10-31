import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../src/index.js';
import { ChartExample } from './chart.js';
it('runs chart kinds, host data and real states in an isolated store', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChartExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Reference activity' })).toBeVisible();
  await user.type(screen.getByRole('textbox', { name: 'Chart label' }), ' updated');
  for (const kind of ['Area', 'Bar', 'Donut']) {
    await chooseOption(user, 'Chart kind', kind);
    expect(screen.getByRole('table')).toBeVisible();
  }
  await chooseOption(user, 'Chart kind', 'Line');
  for (const label of [
    'Missing chart values',
    'Zero chart values',
    'Empty chart data',
    'Right to left chart',
    'Inverted chart template',
  ]) {
    await user.click(screen.getByRole('switch', { name: label }));
    await user.click(screen.getByRole('switch', { name: label }));
  }
  await user.clear(screen.getByRole('textbox', { name: 'Chart label' }));
  await user.click(screen.getByRole('button', { name: 'Preview loading chart' }));
  expect(screen.getByRole('status')).toHaveTextContent('Loading chart');
  await user.click(screen.getByRole('button', { name: 'Preview failed chart' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Unable');
  await user.click(screen.getByRole('button', { name: 'Retry chart' }));
  await user.click(screen.getByRole('button', { name: 'Restore chart' }));
  expect(screen.getByRole('img', { name: 'Reference activity' })).toBeVisible();
});

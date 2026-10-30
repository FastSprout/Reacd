import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { TabsExample } from './tabs.js';

it('retains documented settings through selection and interaction modes', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <TabsExample />
    </ReacdProvider>,
  );
  const alias = screen.getByLabelText('Account alias');
  await user.type(alias, 'Local alias');
  await user.click(screen.getByRole('tab', { name: 'Billing preferences' }));
  expect(screen.getByRole('tabpanel', { name: 'Billing preferences' })).toBeVisible();
  await user.click(screen.getByRole('tab', { name: 'Account preferences' }));
  expect(alias).toHaveValue('Local alias');
  await user.click(screen.getByRole('switch', { name: 'Vertical tabs' }));
  await user.click(screen.getByRole('switch', { name: 'Manual tab activation' }));
  expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  await user.click(screen.getByRole('switch', { name: 'Vertical tabs' }));
  await user.click(screen.getByRole('switch', { name: 'Manual tab activation' }));
  expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
});

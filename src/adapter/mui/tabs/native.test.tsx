import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Typography from '@mui/material/Typography';
import { expect, it, vi } from 'vitest';
import { MuiTabs } from './tabs.adapter.js';
it('uses Material Tabs with native keyboard navigation', async () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <MuiTabs
      label="Views"
      value="one"
      onValueChange={change}
      items={[
        { value: 'one', label: 'First', content: <Typography>One</Typography> },
        { value: 'two', label: 'Second', content: <Typography>Two</Typography> },
      ]}
    />,
  );
  expect(screen.getByRole('tablist', { name: 'Views' }).className).toContain(
    'MuiTabs-list',
  );
  await userEvent.click(screen.getByRole('tab', { name: 'Second' }));
  expect(change).toHaveBeenCalledWith('two');
});

it('supports manual activation through the native vertical Tabs API', async () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <MuiTabs
      label="Views"
      orientation="vertical"
      activationMode="manual"
      value="one"
      onValueChange={change}
      items={[
        { value: 'one', label: 'First', content: <Typography>One</Typography> },
        { value: 'two', label: 'Second', content: <Typography>Two</Typography> },
      ]}
    />,
  );
  screen.getByRole('tab', { name: 'First' }).focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus();
  expect(change).not.toHaveBeenCalled();
  await userEvent.keyboard('{Enter}');
  expect(change).toHaveBeenCalledWith('two');
});

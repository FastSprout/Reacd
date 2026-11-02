import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { TooltipExample } from './tooltip.js';

it('adds a hint without replacing the save action', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <TooltipExample />
    </ReacdProvider>,
  );
  const save = screen.getByRole('button', { name: 'Save draft' });
  await user.hover(save);
  expect(await screen.findByRole('tooltip')).toHaveTextContent(
    'Save your changes without publishing.',
  );
  await user.click(save);
  expect(screen.getByText('Draft saved.')).toBeVisible();
});

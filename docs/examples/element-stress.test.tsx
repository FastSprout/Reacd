import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ElementStressExample } from './element-stress.js';
it('keeps long-content preview actions and input limits executable', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ElementStressExample />
    </ReacdProvider>,
  );
  const input = screen.getByRole('textbox', { name: 'Element stress text' });
  await user.clear(input);
  const card = screen.getByRole('region', { name: 'Resilient element content' });
  await user.click(
    within(card).getByRole('button', {
      name: 'Content stays inside its component',
    }),
  );
  await user.click(screen.getByRole('button', { name: 'Accept stress example' }));
  expect(screen.getByText('Stress actions: 2')).toBeInTheDocument();
  await user.click(
    screen.getByRole('button', { name: 'Dismiss Content stays inside its component' }),
  );
  expect(screen.queryByRole('alert')).toBeNull();
  await user.type(input, 'Updated content');
  expect(
    within(card).getByRole('progressbar', { name: 'Updated content' }),
  ).toBeInTheDocument();
});

import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChatPaletteExample } from './chat-palette.js';

it('composes a modal conversation and scoped dismissal', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChatPaletteExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Open example conversation' }));
  const draft = await screen.findByRole('textbox', { name: 'Palette message' });
  await user.type(draft, 'Palette draft');
  await user.keyboard('{Enter}');
  expect(
    within(screen.getByRole('log', { name: 'Palette transcript' })).getByText(
      'Palette draft',
      { exact: true },
    ),
  ).toBeVisible();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog', { name: 'Example conversation' })).toBeNull();
});

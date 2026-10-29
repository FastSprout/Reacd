import { chooseOption } from '../../test-support/select-choice.js';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../src/index.js';
import { ContentSearchExample } from './content-search.js';
import { ContentSearchButtonExample } from './content-search-button.js';

it('runs the documented veto, status, query and accepted-action flow', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ContentSearchExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Open documentation search' }));
  const query = screen.getByRole('combobox', { name: 'Find documentation' });
  await user.type(query, 'engine');
  const command = screen.getByRole('option', {
    name: 'Inspect architecture reference',
  });
  await user.click(
    screen.getByRole('switch', { name: 'Veto documentation selection' }),
  );
  await user.click(command);
  expect(screen.getByRole('dialog')).toBeVisible();
  await user.click(
    screen.getByRole('switch', { name: 'Veto documentation selection' }),
  );
  for (const status of ['Loading', 'Error', 'Ready']) {
    await chooseOption(user, 'Documentation result status', status);
  }
  await user.click(command);
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(screen.getByText('Architecture reference inspected.')).toBeVisible();
});

it('documents the standalone host search request', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ContentSearchButtonExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Waiting for a request.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Request host search' }));
  expect(screen.getByText('The host received a search request.')).toBeVisible();
});

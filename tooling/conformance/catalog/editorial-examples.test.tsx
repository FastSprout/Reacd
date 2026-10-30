import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { EditorialExamples } from './editorial-examples.js';

it('retains editorial state through local layout changes', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <EditorialExamples />
    </ReacdProvider>,
  );
  const field = screen.getByLabelText('Blog post draft');
  await user.type(field, 'Local editorial state');
  for (const name of ['Inspect illustrative article', 'Review illustrative version']) {
    await user.click(screen.getByRole('button', { name }));
  }
  expect(screen.getByText('Article inspected')).toBeVisible();
  expect(screen.getByText('Version reviewed')).toBeVisible();
  for (const name of [
    'Vertical blog collection',
    'Version indicator',
    'Collection version indicators',
    'Editorial RTL',
  ]) {
    await user.click(screen.getByRole('switch', { name }));
  }
  expect(field).toHaveValue('Local editorial state');
});

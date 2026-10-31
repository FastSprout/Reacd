import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageNavigationExamples } from './page-navigation-examples.js';

it('preserves independent page and CTA drafts across structural changes', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PageNavigationExamples />
    </ReacdProvider>,
  );
  const cta = screen.getByLabelText('Page CTA draft');
  const page = screen.getByLabelText('Three-region page draft');
  await user.type(cta, 'Local CTA state');
  await user.type(page, 'Local page state');
  await user.click(screen.getByRole('button', { name: 'Confirm CTA draft' }));
  expect(screen.getByText('Draft confirmed locally')).toBeVisible();
  for (const name of [
    'Reverse CTA regions',
    'Show page side regions',
    'Page navigation RTL',
  ]) {
    await user.click(screen.getByRole('switch', { name }));
  }
  expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  expect(cta).toHaveValue('Local CTA state');
  expect(page).toHaveValue('Local page state');
});

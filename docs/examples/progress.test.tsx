import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { installLayout } from '../../test-support/layout-observer.js';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { beforeEach, afterEach, expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ProgressExample } from './progress.js';
it('runs documented progress, indeterminate and status controls', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ProgressExample />
    </ReacdProvider>,
  );
  const slider = await screen.findByRole('slider', { name: /^Uploaded item count/ });
  slider.focus();
  await user.keyboard('{ArrowRight}');
  await user.click(screen.getByRole('switch', { name: 'Indeterminate upload' }));
  expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  await user.click(screen.getByRole('switch', { name: 'Indeterminate upload' }));
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '125');
  await user.click(screen.getByRole('switch', { name: 'Show progress value' }));
  expect(screen.queryByText('25%')).toBeNull();
});

let restoreLayout: () => void;
beforeEach(() => {
  restoreLayout = installLayout();
});
afterEach(() => restoreLayout());

import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { TimelineExample } from './timeline.js';
import { ScrollAreaExample } from './scroll-area.js';

it('changes the documented timeline and retains controlled progress', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <TimelineExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Implementation' }));
  expect(screen.getByText('Current milestone: build')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Reverse timeline' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left timeline' }));
  await user.click(screen.getByRole('switch', { name: 'Horizontal timeline' }));
  expect(screen.getByRole('list')).toHaveAttribute('data-orientation', 'horizontal');
  expect(screen.getByRole('button', { name: 'Release review' })).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Horizontal timeline' }));
});
it('keeps scroll-area actions across orientations', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ScrollAreaExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Open Architecture' }));
  expect(screen.getByText('Opened Architecture.')).toBeInTheDocument();
  await user.click(screen.getByRole('switch', { name: 'Horizontal records' }));
  await user.click(screen.getByRole('switch', { name: 'Right to left records' }));
  await user.click(screen.getByRole('button', { name: 'Open State' }));
  expect(screen.getByText('Opened State.')).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Reference records' })).toHaveAttribute(
    'tabindex',
    '0',
  );
  await user.click(screen.getByRole('switch', { name: 'Horizontal records' }));
});

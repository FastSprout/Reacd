import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { MarqueeExample } from './marquee.js';
it('runs documented readable motion, readonly and empty controls', async () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
  const user = userEvent.setup();
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <MarqueeExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Resume movement' }));
  expect(screen.getByRole('button', { name: 'Pause movement' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Pause movement' }));
  await user.click(screen.getByText('Read all notices'));
  await user.clear(screen.getByRole('textbox', { name: 'Marquee notice text' }));
  await user.type(
    screen.getByRole('textbox', { name: 'Marquee notice text' }),
    'Edited notice',
  );
  await user.click(screen.getByRole('switch', { name: 'Right to left marquee' }));
  await user.click(screen.getByRole('switch', { name: 'Backward marquee' }));
  await user.click(screen.getByRole('switch', { name: 'Fast marquee' }));
  await user.click(screen.getByRole('switch', { name: 'Readonly marquee' }));
  expect(screen.queryByRole('button')).toBeNull();
  expect(screen.getByRole('list', { name: 'Reference notices' })).toHaveTextContent(
    'Edited notice',
  );
  await user.click(screen.getByRole('switch', { name: 'Empty marquee' }));
  expect(screen.getByRole('status')).toHaveTextContent('No notices available.');
  vi.unstubAllGlobals();
});

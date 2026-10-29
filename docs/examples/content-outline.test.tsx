import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ReacdProvider } from '../../src/index.js';
import { ContentNavigationExample } from './content-navigation.js';
import { ContentTocExample } from './content-toc.js';

vi.mock('../../src/renderer/navigation/native-navigation.js', () => ({
  followHref: vi.fn(),
}));

it('runs controlled navigation through veto and recovery', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ContentNavigationExample />
    </ReacdProvider>,
  );
  const region = within(screen.getByRole('navigation', { name: 'Documentation tree' }));
  await user.clear(screen.getByLabelText('Documentation group title'));
  await user.click(region.getByRole('button', { name: 'Expand Guides' }));
  await user.click(screen.getByRole('switch', { name: 'Veto document activation' }));
  await user.click(region.getByRole('link', { name: 'Navigation introduction' }));
  expect(screen.getByText('Current document: none')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Veto document activation' }));
  await user.click(region.getByRole('link', { name: 'Navigation introduction' }));
  expect(screen.getByText('Current document: navigation-intro')).toBeVisible();
  for (const name of [
    'Read-only document expansion',
    'Disable document navigation',
    'No navigation documents',
  ]) {
    await user.click(screen.getByRole('switch', { name }));
    await user.click(screen.getByRole('switch', { name }));
  }
});

it('runs explicit outline state without claiming scroll observation', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ContentTocExample />
    </ReacdProvider>,
  );
  const region = within(
    screen.getByRole('navigation', { name: 'On this reference page' }),
  );
  await user.click(screen.getByRole('switch', { name: 'Veto outline activation' }));
  await user.click(region.getByRole('link', { name: 'Outline details' }));
  expect(screen.getByText('Current heading: none')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Veto outline activation' }));
  await user.click(region.getByRole('link', { name: 'Outline details' }));
  expect(screen.getByText('Current heading: outline-details')).toBeVisible();
  for (const name of ['No outline headings', 'Disable outline navigation']) {
    await user.click(screen.getByRole('switch', { name }));
    await user.click(screen.getByRole('switch', { name }));
  }
});

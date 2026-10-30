import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PagePresentationExamples } from './page-presentation-examples.js';

it('retains drafts through every local layout control', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <PagePresentationExamples />
    </ReacdProvider>,
  );
  const card = screen.getByLabelText('Page card draft');
  const hero = screen.getByLabelText('Page hero draft');
  await user.type(card, 'Card state');
  await user.type(hero, 'Hero state');
  await user.click(screen.getByRole('button', { name: 'Inspect feature details' }));
  expect(screen.getByText('Feature inspected')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Toggle feature explanation' }));
  expect(screen.getByText('Feature explanation expanded')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Toggle feature explanation' }));
  expect(screen.getByText('Feature explanation collapsed')).toBeVisible();
  for (const name of [
    'Reverse hero regions',
    'Horizontal hero preference',
    'Page presentation RTL',
  ]) {
    await user.click(screen.getByRole('switch', { name }));
  }
  expect(card).toHaveValue('Card state');
  expect(hero).toHaveValue('Hero state');
  const heading = screen.getByRole('heading', {
    name: 'PageHeroRetainsReadableLongUnbrokenContentAcrossNarrowScreens',
  });
  expect(
    hero.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING,
  ).toBeTruthy();
});

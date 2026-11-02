import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageHeroExample } from './page-hero.js';

it('retains the rich PageHero draft while toggling layout', async () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <PageHeroExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);
  const draft = screen.getByRole('textbox', { name: 'Page hero draft' });
  await userEvent.type(draft, 'Launch notes');
  await userEvent.click(screen.getByRole('switch', { name: 'Reverse hero regions' }));
  await userEvent.click(
    screen.getByRole('switch', { name: 'Horizontal hero preference' }),
  );
  expect(screen.getByRole('textbox', { name: 'Page hero draft' })).toBe(draft);
  expect(draft).toHaveValue('Launch notes');
});

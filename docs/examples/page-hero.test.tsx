import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageHeroExample } from './page-hero.js';

it('renders the runnable PageHero reference', () => {
  render(
    <ReacdProvider>
      <PageHeroExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);
});

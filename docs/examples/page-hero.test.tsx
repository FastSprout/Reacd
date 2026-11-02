import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { PageHeroExample } from './page-hero.js';

it('introduces the product without stress text or layout controls', () => {
  render(
    <ReacdProvider>
      <PageHeroExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('heading', { name: 'Build with reacd' })).toBeVisible();
  expect(screen.queryByRole('switch')).toBeNull();
  expect(screen.queryByRole('textbox')).toBeNull();
});

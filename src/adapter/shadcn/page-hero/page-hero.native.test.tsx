import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageHero } from './page-hero.adapter.js';

it('preserves every hero region with a semantic SDK heading', () => {
  render(
    <ShadcnPageHero
      title="Compose interfaces"
      headline="React components"
      description="Closed TSX"
      orientation="horizontal"
      reverse
      header="Header"
      footer="Footer"
      top="Top"
      bottom="Bottom"
      links="Actions"
    >
      Example source
    </ShadcnPageHero>,
  );
  expect(
    screen.getByRole('heading', { name: 'Compose interfaces', level: 1 }),
  ).not.toBeNull();
  for (const text of [
    'React components',
    'Closed TSX',
    'Header',
    'Footer',
    'Top',
    'Bottom',
    'Actions',
    'Example source',
  ])
    expect(screen.getByText(text)).not.toBeNull();
});

it('keeps optional regions absent and preserves an untitled heading scope', () => {
  const view = render(<ShadcnPageHero />);
  expect(screen.queryByRole('heading')).toBeNull();
  view.rerender(
    <ShadcnPageHero>
      <ShadcnPageHero title="Nested introduction" />
    </ShadcnPageHero>,
  );
  expect(
    screen.getByRole('heading', { name: 'Nested introduction', level: 1 }),
  ).not.toBeNull();
  view.rerender(
    <ShadcnPageHero title="Introduction">
      <ShadcnPageHero title="Nested introduction" />
    </ShadcnPageHero>,
  );
  expect(
    screen.getByRole('heading', { name: 'Nested introduction', level: 2 }),
  ).not.toBeNull();
});

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiMain } from '../main/main.adapter.js';
import { MuiPage } from '../page/page.adapter.js';
import { MuiSection } from '../section/section.adapter.js';
import { MuiPageHeader } from '../page-header/page-header.adapter.js';
import { HeadingLevelContext } from '../../../renderer/heading/heading-context.js';

it('preserves one main and bounded nested native heading semantics', () => {
  render(
    <MuiMain>
      <MuiPage title="Application" anchor="app">
        <MuiMain>
          <MuiPageHeader title="Main content" />
        </MuiMain>
        <MuiSection title="Section">
          <MuiPageHeader title="Introduction" />
          <MuiPage title="Nested">
            <MuiPageHeader title="Nested content" />
          </MuiPage>
        </MuiSection>
      </MuiPage>
    </MuiMain>,
  );
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(
    screen.getByRole('heading', { name: 'Application', level: 1 }),
  ).toHaveAttribute('id', 'app');
  expect(
    screen.getByRole('heading', { name: 'Application', level: 1 }),
  ).toHaveAttribute('tabindex', '-1');
  for (const [name, level] of [
    ['Section', 2],
    ['Introduction', 3],
    ['Nested', 3],
    ['Nested content', 4],
  ] as const) {
    expect(screen.getByRole('heading', { name, level })).toBeVisible();
  }
});
it('caps headings and preserves untitled introduction scope', () => {
  render(
    <HeadingLevelContext value={6}>
      <MuiPageHeader>
        <MuiPageHeader title="Untitled descendant" />
      </MuiPageHeader>
    </HeadingLevelContext>,
  );
  expect(
    screen.getByRole('heading', { name: 'Untitled descendant', level: 6 }),
  ).toBeVisible();
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { muiAdapter } from '@fastsprout/reacd-mui';
import { Page, PageHeader, ReacdProvider, Section } from '../../index.js';
import { HEADING_LEVELS } from '../../core/heading-policy.js';
import { HeadingLevelContext } from './heading-context.js';

describe.each([shadcnAdapter, muiAdapter])('$id semantic heading scope', (adapter) => {
  it.each(HEADING_LEVELS)('preserves the bounded inherited level %s', (level) => {
    render(
      <ReacdProvider adapter={adapter}>
        <HeadingLevelContext.Provider value={level}>
          <PageHeader title="Scoped title" />
        </HeadingLevelContext.Provider>
      </ReacdProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Scoped title', level })).toBeVisible();
  });

  it('keeps one main and progresses headings through nested page sections', () => {
    render(
      <ReacdProvider adapter={adapter}>
        <Page title="Application">
          <Section title="Section" description="Section description">
            <PageHeader title="Introduction" />
            <Page title="Nested page" subtitle="Nested context">
              <PageHeader title="Nested content" />
            </Page>
          </Section>
        </Page>
      </ReacdProvider>,
    );
    expect(screen.getAllByRole('main')).toHaveLength(1);
    for (const [name, level] of [
      ['Application', 1],
      ['Section', 2],
      ['Introduction', 3],
      ['Nested page', 3],
      ['Nested content', 4],
    ] as const) {
      expect(screen.getByRole('heading', { name, level })).toBeVisible();
    }
  });
});

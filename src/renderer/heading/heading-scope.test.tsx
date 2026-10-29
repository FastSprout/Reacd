import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HEADING_LEVELS } from '../../core/heading-policy.js';
import { HeadingLevelContext } from './heading-context.js';
import { PageHeading } from '../page-introduction/page-heading.js';
import { PageSurface } from '../page/page.renderer.js';
import { SectionSurface } from '../section/section.renderer.js';

describe('trusted semantic heading scope', () => {
  it.each(HEADING_LEVELS)('renders the bounded level %s', (level) => {
    render(
      <HeadingLevelContext.Provider value={level}>
        <PageHeading title="Scoped title" />
      </HeadingLevelContext.Provider>,
    );
    expect(screen.getByRole('heading', { name: 'Scoped title', level })).toBeVisible();
  });

  it('keeps one main and progresses headings through nested page sections', () => {
    render(
      <PageSurface title="Application">
        <SectionSurface title="Section" description="Section description">
          <PageHeading title="Introduction" />
          <PageSurface title="Nested page" subtitle="Nested context">
            <PageHeading title="Nested content" />
          </PageSurface>
        </SectionSurface>
      </PageSurface>,
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

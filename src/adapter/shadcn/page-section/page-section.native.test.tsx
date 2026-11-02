import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageSection } from './page-section.adapter.js';

it('keeps a semantic gallery section and every declared presentation region', () => {
  render(
    <ShadcnPageSection
      title="Build with reacd"
      anchor="gallery"
      headline="Components"
      description="Native controls"
      leading="Leading"
      features="Features"
      links="Actions"
      top="Top"
      header="Header"
      footer="Footer"
      bottom="Bottom"
    >
      Gallery
    </ShadcnPageSection>,
  );
  const heading = screen.getByRole('heading', { name: 'Build with reacd', level: 2 });
  expect(heading.id).toBe('gallery');
  for (const text of [
    'Components',
    'Native controls',
    'Leading',
    'Features',
    'Actions',
    'Top',
    'Header',
    'Footer',
    'Bottom',
    'Gallery',
  ])
    expect(screen.getByText(text)).not.toBeNull();
});

it('supports untitled and reversed horizontal sections without phantom content', () => {
  const view = render(<ShadcnPageSection />);
  expect(screen.queryByRole('heading')).toBeNull();
  view.rerender(
    <ShadcnPageSection orientation="horizontal" reverse>
      <ShadcnPageSection title="Nested gallery" />
    </ShadcnPageSection>,
  );
  expect(
    screen.getByRole('heading', { name: 'Nested gallery', level: 2 }),
  ).not.toBeNull();
  view.rerender(
    <ShadcnPageSection title="Gallery" orientation="horizontal" reverse>
      <ShadcnPageSection title="Nested gallery" />
    </ShadcnPageSection>,
  );
  expect(
    screen.getByRole('heading', { name: 'Nested gallery', level: 3 }),
  ).not.toBeNull();
});

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageHeader } from './page-header.adapter.js';
import { HeadingLevelContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/heading/heading-context.js';

it('uses SDK introduction content and inherited bounded heading metadata', () => {
  const view = render(
    <HeadingLevelContext.Provider value={6}>
      <ShadcnPageHeader
        title="Introduction"
        headline="Guide"
        description="Description"
        anchor="introduction"
        links="Read more"
      >
        Body
      </ShadcnPageHeader>
    </HeadingLevelContext.Provider>,
  );
  expect(screen.getByRole('heading', { name: 'Introduction', level: 6 })).toBeVisible();
  expect(screen.getByText('Guide')).toBeVisible();
  expect(screen.getByText('Description')).toBeVisible();
  expect(screen.getByText('Body')).toBeVisible();
  expect(screen.getByText('Read more')).toBeVisible();
  view.rerender(<ShadcnPageHeader>Untitled content</ShadcnPageHeader>);
  expect(screen.queryByRole('heading')).toBeNull();
  expect(screen.getByText('Untitled content')).toBeVisible();
});

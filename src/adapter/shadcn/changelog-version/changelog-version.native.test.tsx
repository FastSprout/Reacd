import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnChangelogVersion } from './changelog-version.adapter.js';
it('keeps optional decorative indicators separate from explicit version text', () => {
  const view = render(
    <ShadcnChangelogVersion title="Version1" header="Header" date="2026-11-02">
      Content
    </ShadcnChangelogVersion>,
  );
  expect(view.container.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  expect(screen.getByRole('article')).toHaveTextContent('Version1');
  view.rerender(<ShadcnChangelogVersion title="Version1" indicator={false} />);
  expect(view.container.querySelector('svg[aria-hidden="true"]')).toBeNull();
  expect(screen.getByRole('heading')).toHaveTextContent('Version1');
  view.rerender(<ShadcnChangelogVersion indicator={false} header="Retained header" />);
  expect(screen.getByText('Retained header')).toBeVisible();
});

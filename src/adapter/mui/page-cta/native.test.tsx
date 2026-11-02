import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiPageCTA } from './page-cta.adapter.js';
it.each(['solid', 'outline', 'soft', 'subtle', 'naked'] as const)(
  'uses native Paper for %s call-to-action regions',
  (variant) => {
    render(
      <MuiPageCTA
        variant={variant}
        title="Launch"
        description="Ready"
        headline="Workspace"
        top="Top"
        bottom="Bottom"
        header="Header"
        footer="Footer"
        links="Actions"
      >
        Content
      </MuiPageCTA>,
    );
    expect(
      screen.getByRole('heading', { name: 'Launch' }).closest('.MuiPaper-root'),
    ).not.toBeNull();
    expect(screen.getByText('Content')).toBeVisible();
  },
);
it('supports the native default surface with optional introduction content', () => {
  const view = render(<MuiPageCTA />);
  expect(view.container.querySelector('.MuiPaper-outlined')).not.toBeNull();
});

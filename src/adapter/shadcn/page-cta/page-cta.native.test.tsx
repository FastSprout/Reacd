import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageCTA } from './page-cta.adapter.js';
import { PAGE_CTA_VARIANTS } from '../../../core/page-navigation-policy.js';
it('composes native Card and Hero while preserving independent content', () => {
  const child = <input aria-label="Draft" defaultValue="Saved" />;
  const view = render(
    <ShadcnPageCTA
      title="Start"
      description="Continue setup"
      headline="Quick start"
      top="Top"
      header="Header"
      footer="Footer"
      bottom="Bottom"
      links={<button>Confirm</button>}
    >
      {child}
    </ShadcnPageCTA>,
  );
  const field = screen.getByRole('textbox');
  expect(screen.getByRole('heading')).toHaveTextContent('Start');
  for (const variant of PAGE_CTA_VARIANTS) {
    view.rerender(
      <ShadcnPageCTA title="Start" variant={variant} reverse orientation="horizontal">
        {child}
      </ShadcnPageCTA>,
    );
    expect(screen.getByRole('textbox')).toBe(field);
    expect(field).toHaveValue('Saved');
    expect(
      field.compareDocumentPosition(screen.getByRole('heading')) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  }
  view.rerender(<ShadcnPageCTA />);
  expect(screen.queryByRole('heading')).toBeNull();
});

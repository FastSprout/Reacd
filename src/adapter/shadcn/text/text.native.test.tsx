import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnText } from './text.adapter.js';

it('maps content to SDK typography with explicit line and weight intent', () => {
  const view = render(<ShadcnText>Content</ShadcnText>);
  expect(screen.getByText('Content').className).toContain('text-base');
  for (const role of ['headline', 'subheadline', 'display', 'caption'] as const) {
    view.rerender(
      <ShadcnText role={role} weight="bold" lineLimit={2}>
        Content
      </ShadcnText>,
    );
    expect(screen.getByText('Content').className).toContain('font-bold');
    expect(screen.getByText('Content')).toHaveStyle({ overflow: 'hidden' });
  }
});

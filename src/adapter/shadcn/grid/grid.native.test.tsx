import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnGrid } from './grid.adapter.js';

it.each([1, 2, 3, 4, 5, 6])('configures responsive SDK columns: %s', (columns) => {
  const view = render(<ShadcnGrid columns={columns}>Content</ShadcnGrid>);
  expect(screen.getByText('Content').className).toContain('grid');
  view.rerender(
    <ShadcnGrid columns={columns} spacing="small">
      Content
    </ShadcnGrid>,
  );
  expect(screen.getByText('Content')).toHaveStyle({ gap: 'var(--space-small)' });
});

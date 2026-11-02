import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageGrid } from './page-grid.adapter.js';
it('delegates capped intrinsic tracks to native shadcn Grid composition', () => {
  render(
    <ShadcnPageGrid>
      {null}
      {false}
      <span>Content</span>
    </ShadcnPageGrid>,
  );
  const grid = screen.getByText('Content').parentElement;
  expect(grid?.className).toContain('grid');
  expect(grid?.style.gridTemplateColumns).toContain('(3 - 1)');
  expect(grid?.style.gridTemplateColumns).toContain('repeat(auto-fit');
});

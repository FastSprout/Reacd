import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiCodeBlock } from './code-block.adapter.js';
it('uses Material Paper and Typography with escaped source content', () => {
  render(<MuiCodeBlock label="Source" content="<script>unsafe()</script>" />);
  expect(screen.getByRole('region', { name: 'Source' }).className).toContain(
    'MuiPaper-root',
  );
  expect(screen.getByText('<script>unsafe()</script>')).toBeVisible();
});

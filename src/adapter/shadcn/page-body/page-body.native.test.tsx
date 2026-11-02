import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnPageBody } from './page-body.adapter.js';
it('uses native Card content spacing without a nested main landmark', () => {
  render(<ShadcnPageBody>Content</ShadcnPageBody>);
  expect(screen.getByRole('article')).toHaveTextContent('Content');
  expect(screen.getByRole('article').className).toContain('p-0');
  expect(screen.queryByRole('main')).toBeNull();
});

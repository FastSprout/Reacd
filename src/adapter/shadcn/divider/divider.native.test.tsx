import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnDivider } from './divider.adapter.js';

it('uses the official SDK semantic separator', () => {
  render(<ShadcnDivider />);
  expect(screen.getByRole('separator').className).toContain('bg-border');
});

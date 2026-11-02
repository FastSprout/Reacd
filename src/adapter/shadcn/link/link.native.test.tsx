import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnLink } from './link.adapter.js';

it('composes native navigation with the SDK Button asChild API', () => {
  const view = render(<ShadcnLink label="Guide" href="/guide" active newWindow />);
  const link = screen.getByRole('link', { name: 'Guide' });
  expect(link.tagName).toBe('A');
  expect(link).toHaveAttribute('href', '/guide');
  expect(link).toHaveAttribute('aria-current', 'page');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link.className).toContain('underline-offset');
  expect(link.className).toContain('whitespace-normal');
  expect(link).toHaveStyle({ height: 'auto', overflowWrap: 'anywhere' });
  view.rerender(<ShadcnLink label="Guide" href="/guide" disabled />);
  expect(link).toHaveAttribute('aria-disabled', 'true');
  expect(link).not.toHaveAttribute('href');
  expect(link).not.toHaveAttribute('target');
  expect(link).not.toHaveAttribute('aria-current');
});

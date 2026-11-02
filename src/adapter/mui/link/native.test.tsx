import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiLink } from './link.adapter.js';
it('uses Material Link and ButtonBase APIs for safe inactive navigation', () => {
  const view = render(<MuiLink label="Guide" href="https://reacd.dev/" newWindow />);
  expect(screen.getByRole('link', { name: 'Guide' }).className).toContain(
    'MuiLink-root',
  );
  expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  view.rerender(<MuiLink label="Guide" href="#guide" disabled active />);
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('aria-disabled', 'true');
  expect(link).not.toHaveAttribute('href');
  expect(link).toHaveAttribute('tabindex', '-1');
  expect(window.location.hash).toBe('');
});

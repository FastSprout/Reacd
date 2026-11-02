import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { HEADING_LEVELS } from '../../../core/heading-policy.js';
import { ShadcnProseHeading } from './typography.js';
it.each(HEADING_LEVELS)('renders the native semantic recipe heading %s', (level) => {
  render(
    <ShadcnProseHeading level={level} id={`heading-${level}`}>
      Heading
    </ShadcnProseHeading>,
  );
  const heading = screen.getByRole('heading', { name: 'Heading', level });
  expect(heading).toHaveAttribute('id', `heading-${level}`);
  expect(heading).toHaveAttribute('tabindex', '-1');
  expect(heading.className).toContain('scroll-m-20');
});
it('keeps an unanchored recipe heading out of the tab order', () => {
  render(<ShadcnProseHeading level={1}>Heading</ShadcnProseHeading>);
  expect(screen.getByRole('heading')).not.toHaveAttribute('tabindex');
});

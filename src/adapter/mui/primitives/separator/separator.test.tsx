import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiSeparatorPrimitive } from './separator.js';

it.each(['horizontal', 'vertical'] as const)(
  'preserves the direct line and label structure for %s separators',
  (orientation) => {
    render(
      <MuiSeparatorPrimitive orientation={orientation} decorative={false}>
        <span data-line="start" />
        <span>Details</span>
        <span data-line="end" />
      </MuiSeparatorPrimitive>,
    );
    const separator = screen.getByRole('separator');
    expect(separator.children).toHaveLength(3);
    expect(separator.firstElementChild).toHaveAttribute('data-line', 'start');
    expect(separator.lastElementChild).toHaveAttribute('data-line', 'end');
  },
);

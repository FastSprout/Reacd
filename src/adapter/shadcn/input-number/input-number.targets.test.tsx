import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { ShadcnInputNumber } from './input-number.adapter.js';

it('applies the named target minimum to both native step controls', () => {
  render(
    <ShadcnInputNumber label="Quantity" value={1} onValueChange={vi.fn()} />,
  );
  for (const name of ['Decrease Quantity', 'Increase Quantity']) {
    expect(screen.getByRole('button', { name })).toHaveStyle({
      minInlineSize: `${LAYOUT_POLICY.controlTargetPx}px`,
      minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px`,
    });
  }
});

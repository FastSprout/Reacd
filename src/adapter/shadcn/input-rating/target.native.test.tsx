import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { ShadcnInputRating } from './input-rating.adapter.js';

it('keeps its actual SDK Slider rating interaction root policy-sized', () => {
  render(
    <ShadcnInputRating
      label="Quality"
      value={2.5}
      step={0.5}
      onValueChange={vi.fn()}
    />,
  );
  const thumb = screen.getByRole('slider', { name: 'Quality' });
  expect(thumb.closest('[data-slot="slider"]')).toHaveStyle({
    minBlockSize: `${LAYOUT_POLICY.controlTargetPx}px`,
  });
  expect(thumb.className).toContain('size-4');
});

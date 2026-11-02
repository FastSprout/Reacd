import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { LAYOUT_POLICY } from '../../../core/policy.js';
import { MuiInputRating } from './input-rating.adapter.js';

it('keeps actual Material Rating and radio labels policy-sized', () => {
  render(
    <MuiInputRating label="Quality" value={2.5} step={0.5} onValueChange={vi.fn()} />,
  );
  const group = screen.getByRole('group', { name: 'Quality' });
  const root = group.querySelector('.MuiRating-root');
  expect(root).toHaveStyle({ minHeight: `${LAYOUT_POLICY.controlTargetPx}px` });
  const labels = group.querySelectorAll('.MuiRating-label');
  expect(labels.length).toBeGreaterThan(0);
  for (const label of labels)
    expect(label).toHaveStyle({
      minHeight: `${LAYOUT_POLICY.controlTargetPx}px`,
      alignItems: 'center',
    });
});

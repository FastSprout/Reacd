import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiSkeleton } from './skeleton.adapter.js';
it('uses native Material text skeletons and its own animation', () => {
  const view = render(<MuiSkeleton label="Loading profile" />);
  expect(screen.getByRole('status', { name: 'Loading profile' })).toBeVisible();
  expect(view.container.querySelectorAll('.MuiSkeleton-text')).toHaveLength(3);
  expect(view.container.querySelector('.MuiSkeleton-pulse')).not.toBeNull();
  view.rerender(<MuiSkeleton show={false} />);
  expect(view.container.childElementCount).toBe(0);
});
it.each(['avatar', 'rectangle'] as const)('uses native %s geometry', (shape) => {
  const view = render(<MuiSkeleton shape={shape} size="small" animated={false} />);
  expect(
    view.container.querySelector(
      shape === 'avatar' ? '.MuiSkeleton-circular' : '.MuiSkeleton-rounded',
    ),
  ).not.toBeNull();
  expect(view.container.querySelector('.MuiSkeleton-pulse')).toBeNull();
});

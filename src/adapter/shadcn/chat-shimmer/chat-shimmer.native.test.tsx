import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnChatShimmer } from './chat-shimmer.adapter.js';

it('uses a finite native Skeleton decoration without fading status text', () => {
  const view = render(<ShadcnChatShimmer text="Receiving response" />);
  const status = screen.getByRole('status');
  expect(status).toHaveTextContent('Receiving response');
  expect(status).not.toHaveAttribute('aria-busy');
  const decoration = view.container.querySelector('[data-slot="skeleton"]');
  expect(decoration).toHaveStyle({
    animationIterationCount: '3',
    animationDuration: '1500ms',
  });
  expect(decoration?.className).toContain('motion-reduce:animate-none');
  view.rerender(<ShadcnChatShimmer text="Finished" active={false} />);
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByText('Finished')).toBeVisible();
  expect(view.container.querySelector('[data-slot="skeleton"]')).toBeNull();
});

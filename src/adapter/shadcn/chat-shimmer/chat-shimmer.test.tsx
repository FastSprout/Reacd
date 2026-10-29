import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnChatShimmer } from './chat-shimmer.adapter.js';

it('keeps full text and removes loading semantics when inactive', () => {
  const view = render(<ShadcnChatShimmer text="Reading reference" />);
  expect(screen.getByRole('status')).toHaveTextContent('Reading reference');
  expect(screen.getByRole('status')).not.toHaveAttribute('aria-busy');
  view.rerender(<ShadcnChatShimmer text="Reference read" active={false} />);
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByText('Reference read')).toHaveAttribute('data-active', 'false');
});

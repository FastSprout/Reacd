import { render, screen } from '../../../../test-support/adapter-testing.js';
import { expect, it } from 'vitest';
import { SharedChatShimmer } from './chat-shimmer.adapter.js';

it('keeps full text and removes loading semantics when inactive', () => {
  const view = render(<SharedChatShimmer text="Reading reference" />);
  expect(screen.getByRole('status')).toHaveTextContent('Reading reference');
  expect(screen.getByRole('status')).not.toHaveAttribute('aria-busy');
  view.rerender(<SharedChatShimmer text="Reference read" active={false} />);
  expect(screen.queryByRole('status')).toBeNull();
  expect(screen.getByText('Reference read')).toHaveAttribute('data-active', 'false');
});

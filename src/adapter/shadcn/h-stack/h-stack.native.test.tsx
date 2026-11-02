import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnHStack } from './h-stack.adapter.js';

it('configures SDK content as a wrapping horizontal stack', () => {
  const view = render(<ShadcnHStack>Content</ShadcnHStack>);
  expect(screen.getByText('Content').className).toContain('flex-wrap');
  view.rerender(<ShadcnHStack spacing="large">Content</ShadcnHStack>);
  expect(screen.getByText('Content')).toHaveStyle({ gap: 'var(--space-large)' });
});

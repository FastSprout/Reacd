import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnVStack } from './v-stack.adapter.js';

it('composes vertical content using SDK layout configuration', () => {
  const view = render(<ShadcnVStack>Content</ShadcnVStack>);
  expect(screen.getByText('Content').className).toContain('flex-col');
  expect(screen.getByText('Content')).toHaveStyle({ gap: 'var(--space-medium)' });
  view.rerender(<ShadcnVStack spacing="small">Content</ShadcnVStack>);
  expect(screen.getByText('Content')).toHaveStyle({ gap: 'var(--space-small)' });
});

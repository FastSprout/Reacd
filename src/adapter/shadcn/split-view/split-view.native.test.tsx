import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnSplitView } from './split-view.adapter.js';

it('configures native SDK split layout from core container constraints', () => {
  render(<ShadcnSplitView spacing="large">Panes</ShadcnSplitView>);
  const panes = screen.getByText('Panes');
  expect(panes).toHaveStyle({ gap: 'var(--space-large)' });
  expect(panes.style.gridTemplateColumns).toContain('min(100%, 24rem)');
});

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnViewport } from './viewport.adapter.js';

it('configures the SDK viewport width from declared compact intent', () => {
  const view = render(<ShadcnViewport compact>Content</ShadcnViewport>);
  expect(screen.getByText('Content')).toHaveStyle({ maxWidth: '360px' });
  view.rerender(<ShadcnViewport compact={false}>Content</ShadcnViewport>);
  expect(screen.getByText('Content').style.maxWidth).toBe('');
});

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnBadge } from './badge.adapter.js';

it('uses official SDK badge intent and icon configuration', () => {
  const view = render(<ShadcnBadge label="Ready" />);
  expect(screen.getByText('Ready').className).toContain('bg-secondary');
  view.rerender(
    <ShadcnBadge label="Ready" intent="danger" leadingIcon="warning" size="large" />,
  );
  expect(screen.getByText('Ready').className).toContain('bg-destructive');
});

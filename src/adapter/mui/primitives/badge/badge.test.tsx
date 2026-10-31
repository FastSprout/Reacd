import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiBadgePrimitive } from './badge.js';

it('provides a readable Material badge when no private variant is supplied', () => {
  const { container } = render(<MuiBadgePrimitive>Ready</MuiBadgePrimitive>);
  expect(screen.getByText('Ready')).toBeVisible();
  expect(container.querySelector('.MuiChip-colorPrimary')).toBeInTheDocument();
});

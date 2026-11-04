import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ImageExample } from './image.js';

it('renders the focused public Image example', () => {
  render(<ReacdProvider><ImageExample /></ReacdProvider>);
  expect(screen.getByRole('img', { name: 'Illustrated workspace' }))
    .toHaveAttribute('src', '/color-mode-light.svg');
  expect(screen.queryByRole('combobox')).toBeNull();
});

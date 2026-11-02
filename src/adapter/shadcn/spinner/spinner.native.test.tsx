import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnSpinner } from './spinner.adapter.js';

it('renders the official SDK spinner with the supplied accessible name', () => {
  render(<ShadcnSpinner label="Loading orders" />);
  expect(screen.getByRole('status', { name: 'Loading orders' }).classList).toContain(
    'animate-spin',
  );
});

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiSpinner } from './spinner.adapter.js';
it('uses a named native Material CircularProgress', () => {
  render(<MuiSpinner label="Loading records" />);
  expect(
    screen.getByRole('progressbar', { name: 'Loading records' }).className,
  ).toContain('MuiCircularProgress-root');
});

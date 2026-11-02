import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiDivider } from './divider.adapter.js';
it('uses the native Material Divider', () => {
  render(<MuiDivider />);
  expect(screen.getByRole('separator').className).toContain('MuiDivider-root');
});

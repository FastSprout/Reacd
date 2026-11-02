import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MuiProgress } from './progress.adapter.js';
it('uses Material LinearProgress while preserving logical bounds', () => {
  const view = render(<MuiProgress label="Upload" value={25} max={50} />);
  const progress = screen.getByRole('progressbar', { name: 'Upload' });
  expect(progress.className).toContain('MuiLinearProgress-root');
  expect(progress).toHaveAttribute('aria-valuenow', '25');
  expect(progress).toHaveAttribute('aria-valuemax', '50');
  view.rerender(<MuiProgress label="Upload" value={null} />);
  expect(progress.className).toContain('MuiLinearProgress-indeterminate');
});

it('shows native description and permits hiding the logical value', () => {
  const view = render(
    <MuiProgress label="Work" value={40} description="Processing" showValue={false} />,
  );
  expect(screen.getByText('Processing')).toBeVisible();
  expect(screen.queryByText('40 / 100')).toBeNull();
  view.rerender(<MuiProgress label="Work" />);
  expect(screen.getByRole('progressbar').className).toContain(
    'MuiLinearProgress-indeterminate',
  );
});

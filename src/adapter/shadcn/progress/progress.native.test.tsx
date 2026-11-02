import { DirectionProvider } from '@radix-ui/react-direction';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnProgress } from './progress.adapter.js';

it('maps real values to the SDK indicator and accessible range', () => {
  const view = render(
    <ShadcnProgress
      label="Upload"
      value={5}
      max={10}
      description="Uploading files"
      showValue
    />,
  );
  const control = screen.getByRole('progressbar', { name: 'Upload' });
  expect(control.className).toContain('rounded-full');
  expect(control).toHaveAttribute('aria-valuenow', '5');
  expect(control).toHaveAttribute('aria-valuemax', '10');
  expect(control).toHaveAccessibleDescription('Uploading files');
  expect(screen.getByText('5 / 10')).toBeVisible();
  view.rerender(<ShadcnProgress label="Upload" value={null} showValue />);
  expect(control).not.toHaveAttribute('aria-valuenow');
  view.rerender(<ShadcnProgress label="Upload" />);
  expect(control).not.toHaveAttribute('aria-valuenow');
});

it('anchors the native clipped indicator at the logical start', () => {
  const view = render(
    <DirectionProvider dir="rtl">
      <ShadcnProgress label="Upload" value={25} />
    </DirectionProvider>,
  );
  const control = screen.getByRole('progressbar', { name: 'Upload' });
  expect(control.firstElementChild).toHaveStyle({
    transform: 'translateX(75%)',
  });
  view.rerender(
    <DirectionProvider dir="ltr">
      <ShadcnProgress label="Upload" value={25} />
    </DirectionProvider>,
  );
  expect(control.firstElementChild).toHaveStyle({
    transform: 'translateX(-75%)',
  });
});

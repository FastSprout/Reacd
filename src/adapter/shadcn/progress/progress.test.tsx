import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Progress, ReacdProvider } from '../../../index.js';

it('exposes determinate current/max values and max-aware percentages', () => {
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Progress label="Upload" value={25} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('progressbar', { name: 'Upload' })).toHaveAttribute(
    'aria-valuenow',
    '25',
  );
  expect(screen.getByText('25%')).toBeInTheDocument();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Progress label="Upload" value={250} max={500} description="Half complete" />
    </ReacdProvider>,
  );
  const progress = screen.getByRole('progressbar', { name: 'Upload' });
  expect(progress).toHaveAttribute('aria-valuemax', '500');
  expect(progress).toHaveAccessibleDescription('Half complete');
  expect(screen.getByText('50%')).toBeInTheDocument();
  expect(view.container.querySelector('.reacd-progress-fill')).toHaveStyle({
    inlineSize: '50%',
  });
});

it('distinguishes indeterminate data and optional status content', () => {
  const view = render(
    <ReacdProvider adapter={shadcnAdapter}>
      <Progress label="Upload" value={null} />
    </ReacdProvider>,
  );
  expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  expect(screen.getByText('In progress')).toBeInTheDocument();
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Progress label="Upload" />
    </ReacdProvider>,
  );
  expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  view.rerender(
    <ReacdProvider adapter={shadcnAdapter}>
      <Progress label="Upload" value={50} showValue={false} />
    </ReacdProvider>,
  );
  expect(screen.queryByText('50%')).toBeNull();
});

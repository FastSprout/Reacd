import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Badge, ReacdProvider } from '../../../index.js';

it('keeps badges noninteractive and decorates their visible text safely', () => {
  const view = render(
    <ReacdProvider>
      <Badge label="Ready" />
    </ReacdProvider>,
  );
  expect(screen.getByText('Ready')).toBeInTheDocument();
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(
    <ReacdProvider>
      <Badge label="Published" intent="primary" leadingIcon="check" size="large" />
    </ReacdProvider>,
  );
  expect(screen.getByText('Published').closest('[data-size]')).toHaveAttribute(
    'data-size',
    'large',
  );
  expect(screen.queryByRole('img')).toBeNull();
  view.rerender(
    <ReacdProvider>
      <Badge label="Rejected" intent="danger" size="medium" />
    </ReacdProvider>,
  );
  expect(screen.getByText('Rejected')).toBeInTheDocument();
});

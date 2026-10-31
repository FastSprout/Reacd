import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { expect, it } from 'vitest';
import { Badge, ReacdProvider } from '../../../index.js';

it('keeps badges noninteractive and decorates their visible text safely', () => {
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Badge label="Ready" />
    </ReacdProvider>,
  );
  expect(screen.getByText('Ready')).toBeInTheDocument();
  expect(screen.queryByRole('button')).toBeNull();
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <Badge label="Published" intent="primary" leadingIcon="check" size="large" />
    </ReacdProvider>,
  );
  expect(screen.getByText('Published').closest('[data-size]')).toHaveAttribute(
    'data-size',
    'large',
  );
  expect(screen.queryByRole('img')).toBeNull();
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <Badge label="Rejected" intent="danger" size="medium" />
    </ReacdProvider>,
  );
  expect(screen.getByText('Rejected')).toBeInTheDocument();
});

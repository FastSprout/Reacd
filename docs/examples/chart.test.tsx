import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChartExample } from './chart.js';

it('labels the monthly sales chart and its data', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <ChartExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Monthly sales' })).toBeVisible();
  const data = screen.getByRole('table');
  expect(data).toHaveTextContent('January');
  expect(data).toHaveTextContent('February');
  expect(data).toHaveTextContent('March');
});

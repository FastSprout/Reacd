import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { GridExample } from './grid.js';

it('runs the Grid public example', () => {
  render(
    <ReacdProvider>
      <GridExample />
    </ReacdProvider>,
  );
  for (const name of ['Orders overview', 'Customer overview', 'Delivery overview'])
    expect(screen.getByRole('heading', { name })).toBeVisible();
});

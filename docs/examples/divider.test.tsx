import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { DividerExample } from './divider.js';

it('runs the Divider public example', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <DividerExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('separator')).toBeVisible();
  expect(screen.getByText('After the divider')).toBeVisible();
});

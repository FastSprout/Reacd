import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SpinnerExample } from './spinner.js';

it('runs the Spinner public example', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <SpinnerExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Loading the sample');
});

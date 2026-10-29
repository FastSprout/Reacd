import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { SpacerExample } from './spacer.js';

it('runs the Spacer public example', () => {
  render(
    <ReacdProvider>
      <SpacerExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Start of row')).toBeVisible();
  expect(screen.getByText('End of row')).toBeVisible();
});

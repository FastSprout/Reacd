import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { HStackExample } from './h-stack.js';

it('runs the HStack public example', () => {
  render(
    <ReacdProvider>
      <HStackExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Review workflow')).toBeVisible();
  expect(screen.getByText('Ready for review')).toBeVisible();
});

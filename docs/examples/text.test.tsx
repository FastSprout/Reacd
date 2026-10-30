import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { TextExample } from './text.js';

it('runs the Text public example', () => {
  render(
    <ReacdProvider>
      <TextExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('heading', { name: 'Delivery status' })).toBeVisible();
  expect(screen.getByText('All routes are ready.')).toBeVisible();
});

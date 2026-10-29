import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { AppExample } from './app.js';

it('renders the documented App declaration', () => {
  render(
    <ReacdProvider>
      <AppExample />
    </ReacdProvider>,
  );
  expect(screen.getByText('Application content')).toBeVisible();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from 'reacd';
import { ShellExamples } from './shell-examples.js';

it('composes the five shell examples without native application tags', () => {
  render(
    <ReacdProvider>
      <ShellExamples />
    </ReacdProvider>,
  );
  expect(screen.getByRole('heading', { name: 'Application shells' })).toBeVisible();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SectionExample } from './section.js';

it('runs the Section public example', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <SectionExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('region', { name: 'Release summary' })).toBeVisible();
  expect(screen.getByText('The current release is ready.')).toBeVisible();
});

import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { SkeletonExample } from './skeleton.js';

it('announces that the profile is loading', () => {
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <SkeletonExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status', { name: 'Loading profile' })).toBeVisible();
});

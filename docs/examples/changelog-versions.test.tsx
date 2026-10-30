import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChangelogVersionsExample } from './changelog-versions.js';

it('runs the ChangelogVersions reference example', () => {
  render(
    <ReacdProvider>
      <ChangelogVersionsExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

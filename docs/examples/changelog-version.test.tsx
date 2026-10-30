import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { ChangelogVersionExample } from './changelog-version.js';

it('runs the ChangelogVersion reference example', () => {
  render(
    <ReacdProvider>
      <ChangelogVersionExample />
    </ReacdProvider>,
  );
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

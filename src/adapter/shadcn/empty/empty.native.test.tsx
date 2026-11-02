import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnEmpty } from './empty.adapter.js';

it('uses SDK empty content while preserving every declared slot', () => {
  const view = render(
    <ShadcnEmpty
      title="No projects"
      description="Create a project"
      leading="Icon"
      actions="Create"
      footer="Footer"
    >
      Details
    </ShadcnEmpty>,
  );
  expect(screen.getByRole('region', { name: 'No projects' })).toHaveAttribute(
    'data-slot',
    'empty',
  );
  expect(screen.getByText('Create a project')).toHaveAttribute(
    'data-slot',
    'empty-description',
  );
  expect(screen.getByText('Details')).toBeVisible();
  expect(screen.getByText('Create')).toBeVisible();
  expect(screen.getByText('Footer')).toBeVisible();
  view.rerender(
    <ShadcnEmpty
      title="Loading"
      loading
      loadingLabel="Loading projects"
      variant="soft"
      size="small"
    />,
  );
  expect(screen.getByRole('status', { name: 'Loading projects' })).toBeVisible();
});

it('supports a bare SDK empty state without optional media or content slots', () => {
  render(<ShadcnEmpty title="No results" variant="naked" />);
  expect(screen.getByRole('region', { name: 'No results' })).toBeVisible();
  expect(screen.queryByRole('status')).toBeNull();
});

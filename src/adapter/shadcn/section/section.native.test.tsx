import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnSection } from './section.adapter.js';

it('labels an SDK content region with optional description and anchor', () => {
  const view = render(<ShadcnSection title="Profile">Content</ShadcnSection>);
  expect(screen.getByRole('region', { name: 'Profile' })).toBeVisible();
  view.rerender(
    <ShadcnSection title="Profile" description="Personal details" anchor="profile">
      Content
    </ShadcnSection>,
  );
  expect(screen.getByRole('heading', { name: 'Profile', level: 2 })).toBeVisible();
  expect(screen.getByText('Personal details')).toBeVisible();
  expect(screen.getByRole('region', { name: 'Profile' })).toHaveAttribute(
    'id',
    'profile',
  );
});

it('advances nested SDK section headings', () => {
  render(
    <ShadcnSection title="Parent">
      <ShadcnSection title="Child" />
    </ShadcnSection>,
  );
  expect(screen.getByRole('heading', { name: 'Parent', level: 2 })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Child', level: 3 })).toBeVisible();
});

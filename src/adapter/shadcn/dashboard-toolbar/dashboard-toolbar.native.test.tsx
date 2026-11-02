import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ShadcnDashboardToolbar } from './dashboard-toolbar.adapter.js';

it('uses an SDK group preserving sequential slot order', () => {
  render(
    <ShadcnDashboardToolbar label="Actions" start="Start" end="End">
      Content
    </ShadcnDashboardToolbar>,
  );
  const group = screen.getByRole('group', { name: 'Actions' });
  expect(group.classList.contains('flex-wrap')).toBe(true);
  expect(group).toHaveTextContent('StartContentEnd');
  expect(screen.queryByRole('toolbar')).toBeNull();
});

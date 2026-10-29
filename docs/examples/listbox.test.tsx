import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../src/index.js';
import { ListboxExample } from './listbox.js';

it('runs choices, protection, direction, validation and restoration', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <ListboxExample />
    </ReacdProvider>,
  );
  await user.click(
    within(screen.getByRole('listbox', { name: 'Primary region' })).getByRole(
      'option',
      { name: 'West region' },
    ),
  );
  expect(screen.getByText('Primary: west')).toBeVisible();
  await user.click(
    within(screen.getByRole('listbox', { name: 'Additional regions' })).getByRole(
      'option',
      { name: 'West region' },
    ),
  );
  expect(screen.getByText('Additional: offline, west')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear additional regions' }));
  expect(screen.getByText('Additional: none')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Clear primary region' }));
  expect(screen.getByText('Primary: none')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Save regions' }));
  expect(screen.getByText('Region selection is not saved.')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Restore regions' }));
  await user.click(screen.getByRole('switch', { name: 'Reject selection requests' }));
  await user.click(
    within(screen.getByRole('listbox', { name: 'Primary region' })).getByRole(
      'option',
      { name: 'West region' },
    ),
  );
  await user.click(
    within(screen.getByRole('listbox', { name: 'Additional regions' })).getByRole(
      'option',
      { name: 'West region' },
    ),
  );
  expect(screen.getByText('Primary: 42')).toBeVisible();
  expect(screen.getByText('Additional: offline')).toBeVisible();
  await user.click(screen.getByRole('switch', { name: 'Reject selection requests' }));
  await user.click(
    within(screen.getByRole('listbox', { name: 'Primary region' })).getByRole(
      'option',
      { name: 'West region' },
    ),
  );
  await user.click(
    within(screen.getByRole('listbox', { name: 'Additional regions' })).getByRole(
      'option',
      { name: 'West region' },
    ),
  );
  await user.click(screen.getByRole('switch', { name: 'Right to left regions' }));
  await user.click(screen.getByRole('switch', { name: 'Read-only regions' }));
  expect(screen.getByRole('button', { name: 'Clear primary region' })).toBeDisabled();
  await user.click(screen.getByRole('switch', { name: 'Read-only regions' }));
  await user.click(screen.getByRole('button', { name: 'Save regions' }));
  expect(screen.getByText('Region selection saved.')).toBeVisible();
});

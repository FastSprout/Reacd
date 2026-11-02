import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from './form.adapter.js';
import { ShadcnColorModeSelect } from
  '../color-mode-select/color-mode-select.adapter.js';
import { ShadcnSelect } from '../select/select.adapter.js';

it('closes native appearance and multiple-selection menus when busy', async () => {
  const change = vi.fn();
  const content = (
    <>
      <ShadcnColorModeSelect
        label="Appearance"
        value="system"
        resolvedMode="light"
        onValueChange={change}
      />
      <ShadcnSelect
        label="Roles"
        mode="multiple"
        value={['reader']}
        onValueChange={change}
        items={[{ value: 'reader', label: 'Reader' }]}
      />
    </>
  );
  const view = render(
    <ShadcnForm label="Settings" onSubmit={vi.fn()}>
      {content}
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Appearance' }));
  expect(await screen.findByRole('option', { name: 'Dark' })).toBeVisible();
  view.rerender(
    <ShadcnForm label="Settings" onSubmit={vi.fn()} submitting>
      {content}
    </ShadcnForm>,
  );
  await waitFor(() =>
    expect(screen.queryByRole('option', { name: 'Dark' })).toBeNull(),
  );
  view.rerender(
    <ShadcnForm label="Settings" onSubmit={vi.fn()}>
      {content}
    </ShadcnForm>,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Roles' }));
  expect(await screen.findByRole('option', { name: 'Reader' })).toBeVisible();
  view.rerender(
    <ShadcnForm label="Settings" onSubmit={vi.fn()} submitting>
      {content}
    </ShadcnForm>,
  );
  await waitFor(() =>
    expect(screen.queryByRole('option', { name: 'Reader' })).toBeNull(),
  );
  expect(change).not.toHaveBeenCalled();
});

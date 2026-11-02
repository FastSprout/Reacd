import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ReacdProvider } from '@fastsprout/reacd';
import { AvatarExample } from './avatar.js';

it('shows one identity without avatar workbench controls', () => {
  render(
    <ReacdProvider>
      <AvatarExample />
    </ReacdProvider>,
  );
  expect(screen.getByRole('img', { name: 'Avery Morgan' })).toBeVisible();
  expect(screen.queryByRole('textbox')).toBeNull();
  expect(screen.queryByRole('combobox')).toBeNull();
});

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ReacdProvider } from '../../src/index.js';
import { FieldGroupExample } from './field-group.js';

it('runs the documented orientations, direction and query actions', async () => {
  const user = userEvent.setup();
  render(
    <ReacdProvider>
      <FieldGroupExample />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Search reference' }));
  expect(screen.getByRole('textbox', { name: 'Reference query' })).toHaveValue(
    'Component reference',
  );
  await user.click(screen.getByRole('button', { name: 'Clear reference query' }));
  expect(screen.getByRole('textbox', { name: 'Reference query' })).toHaveValue('');
  await user.click(screen.getByRole('switch', { name: 'Vertical field group' }));
  expect(
    screen.getByRole('group', { name: 'Reference search controls' }),
  ).toHaveAttribute('data-orientation', 'vertical');
  await user.click(screen.getByRole('switch', { name: 'Right to left group' }));
  await user.clear(screen.getByRole('textbox', { name: 'Group action label' }));
  expect(screen.getByRole('button', { name: 'Search reference' })).toBeVisible();
});

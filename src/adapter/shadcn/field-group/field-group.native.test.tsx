import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnFieldGroup } from './field-group.adapter.js';
import { ShadcnButton } from '../button/button.adapter.js';

it('preserves native child keyboard actions and both orientations', async () => {
  const press = vi.fn();
  const user = userEvent.setup();
  const view = render(
    <ShadcnFieldGroup label="Actions">
      <ShadcnButton label="Run" onPress={press} />
      <ShadcnButton label="Unavailable" onPress={press} disabled />
    </ShadcnFieldGroup>,
  );
  expect(screen.getByRole('group', { name: 'Actions' })).toHaveAttribute(
    'data-orientation', 'horizontal',
  );
  expect(view.container.querySelector('[data-slot="field-group"]'))
    .toBeInTheDocument();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Run' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(press).toHaveBeenCalledExactlyOnceWith();
  view.rerender(
    <ShadcnFieldGroup label="Actions" orientation="vertical">
      <ShadcnButton label="Run" onPress={press} />
    </ShadcnFieldGroup>,
  );
  expect(screen.getByRole('group', { name: 'Actions' })).toHaveAttribute(
    'data-orientation', 'vertical',
  );
});

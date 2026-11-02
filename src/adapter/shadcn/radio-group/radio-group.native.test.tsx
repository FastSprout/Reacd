import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnRadioGroup } from './radio-group.adapter.js';

it('uses SDK radio focus navigation, labels and controlled requests', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnRadioGroup
      label="Plan"
      value="one"
      onValueChange={change}
      description="Choose a plan"
      items={[
        { value: 'one', label: 'One', description: 'First option' },
        { value: 'two', label: 'Two' },
      ]}
    />,
  );
  expect(screen.getByRole('radiogroup', { name: 'Plan' })).toHaveAccessibleDescription(
    'Choose a plan',
  );
  const first = screen.getByRole('radio', { name: 'One' });
  expect(first).toHaveAttribute('data-slot', 'radio-group-item');
  first.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(screen.getByRole('radio', { name: 'Two' })).toHaveFocus();
  await userEvent.click(screen.getByRole('radio', { name: 'Two' }));
  expect(change).toHaveBeenCalledWith('two');
  view.rerender(
    <ShadcnRadioGroup
      label="Plan"
      value="one"
      onValueChange={change}
      items={[{ value: 'one', label: 'One' }]}
    />,
  );
  expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-describedby');
});

it('rejects value requests while its portal is inactive', () => {
  const change = vi.fn();
  render(
    <PortalActiveContext value={false}>
      <ShadcnRadioGroup
        label="Plan"
        value=""
        onValueChange={change}
        items={[{ value: 'one', label: 'One' }]}
      />
    </PortalActiveContext>,
  );
  fireEvent.click(screen.getByRole('radio', { name: 'One' }));
  expect(change).not.toHaveBeenCalled();
});

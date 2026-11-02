import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnNavigationMenu } from './navigation-menu.adapter.js';

it('retains full labels and native keyboard disclosure/action behavior', async () => {
  const label = 'Resources_without_word_breaks_'.repeat(8);
  const actionLabel = 'Open the selected documentation resource';
  const press = vi.fn();
  render(<ShadcnNavigationMenu label="Reference" items={[{
    key: 'resources', label, children: [{
      key: 'open', label: actionLabel, onPress: press,
    }],
  }]} />);
  const trigger = screen.getByRole('button', { name: label });
  trigger.focus();
  const user = userEvent.setup();
  await user.keyboard('{Enter}');
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const action = screen.getByRole('button', { name: actionLabel });
  action.focus();
  await user.keyboard('{Enter}');
  expect(press).toHaveBeenCalledExactlyOnceWith();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).toHaveTextContent(label);
});

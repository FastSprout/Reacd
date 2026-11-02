import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnTabs } from './tabs.adapter.js';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnInput } from '../input/input.adapter.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';

it('delegates roving focus and selection to the SDK tabs', async () => {
  const change = vi.fn();
  const items = [
    { value: 'profile', label: 'Profile', content: 'Profile content' },
    { value: 'billing', label: 'Billing', content: 'Billing content' },
    { value: 'locked', label: 'Locked', disabled: true },
  ];
  render(
    <ShadcnTabs label="Settings" items={items} value="profile" onValueChange={change}>
      Shared content
    </ShadcnTabs>,
  );
  expect(screen.getByRole('tablist', { name: 'Settings' })).toBeVisible();
  const profile = screen.getByRole('tab', { name: 'Profile' });
  profile.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
  expect(change).toHaveBeenCalledWith('billing');
  expect(screen.getByText('Shared content')).not.toBeVisible();
  expect(screen.getByRole('tab', { name: 'Locked' })).toBeDisabled();
});

it('retains inactive panel fields and activates only nullish shared content', () => {
  const items = [
    { value: 'profile', label: 'Profile', content: (
      <ShadcnInput label="Name" value="Ada" onValueChange={vi.fn()} />
    ) },
    { value: 'shared', label: 'Shared' },
  ];
  const view = render(
    <ShadcnTabs label="Settings" items={items} value="profile"
      onValueChange={vi.fn()}>
      <ShadcnInput label="Fallback" value="Grace" onValueChange={vi.fn()} />
    </ShadcnTabs>,
  );
  const name = screen.getByRole('textbox', { name: 'Name' });
  expect(screen.getByLabelText('Fallback')).toBeDisabled();
  expect(screen.getByLabelText('Fallback')).not.toBeVisible();
  view.rerender(
    <ShadcnTabs label="Settings" items={items} value="shared"
      onValueChange={vi.fn()}>
      <ShadcnInput label="Fallback" value="Grace" onValueChange={vi.fn()} />
    </ShadcnTabs>,
  );
  expect(name.isConnected).toBe(true);
  expect(name).toBeDisabled();
  expect(name).not.toBeVisible();
  expect(screen.getByRole('textbox', { name: 'Fallback' })).not.toBeDisabled();
});

it(
  'blocks pending tab changes without excluding the selected visible data',
  async () => {
  const change = vi.fn();
  render(
    <ShadcnForm label="Settings" onSubmit={vi.fn()} submitting>
      <ShadcnTabs
        label="Sections"
        value="profile"
        onValueChange={change}
        items={[
          {
            value: 'profile',
            label: 'Profile',
            content: (
              <ShadcnInput
                label="Name"
                name="name"
                value="Ada"
                onValueChange={vi.fn()}
              />
            ),
          },
          { value: 'billing', label: 'Billing', content: 'Billing' },
          { value: 'locked', label: 'Locked', disabled: true },
        ]}
      />
    </ShadcnForm>,
  );
  expect(screen.getByRole('tab', { name: 'Billing' })).toBeDisabled();
  await userEvent.click(screen.getByRole('tab', { name: 'Billing' }));
  expect(change).not.toHaveBeenCalled();
  const form = screen.getByRole('form', { name: 'Settings' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
  expect([...new FormData(form)]).toEqual([['name', 'Ada']]);
});

it('excludes tab fields beneath an inactive scope', () => {
  render(
    <ShadcnForm label="Settings" onSubmit={vi.fn()}>
      <PortalActiveContext value={false}>
        <ShadcnTabs
          label="Sections"
          value="profile"
          onValueChange={vi.fn()}
          orientation="vertical"
          items={[
            {
              value: 'profile',
              label: 'Profile',
              content: (
                <ShadcnInput
                  label="Name"
                  name="name"
                  value="Ada"
                  onValueChange={vi.fn()}
                />
              ),
            },
          ]}
        />
      </PortalActiveContext>
    </ShadcnForm>,
  );
  expect(screen.getByRole('textbox', { name: 'Name' })).toBeDisabled();
  const form = screen.getByRole('form', { name: 'Settings' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
  expect([...new FormData(form)]).toEqual([]);
});

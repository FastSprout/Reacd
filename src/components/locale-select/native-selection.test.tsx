import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ShadcnLocaleSelect } from
  '../../adapter/shadcn/locale-select/locale-select.adapter.js';
import { MuiLocaleSelect } from
  '../../adapter/mui/locale-select/locale-select.adapter.js';
import { ShadcnForm } from '../../adapter/shadcn/form/form.adapter.js';
import { MuiForm } from '../../adapter/mui/form/form.adapter.js';
import { muiAdapter } from '../../adapter/mui/mui.adapter.js';
import { shadcnAdapter } from '../../adapter/shadcn/shadcn.adapter.js';
import { ReacdProvider } from '../../state/provider/provider.js';
import { LocaleSelect } from './index.js';

const locales = [
  { code: 'en-US', label: 'English' },
  { code: 'pl-PL', label: 'Polish' },
];

it.each([shadcnAdapter, muiAdapter])('registers native locale: $id', (adapter) => {
  render(
    <ReacdProvider adapter={adapter}>
      <LocaleSelect
        label="Language" locales={locales} value="en-US" onValueChange={vi.fn()}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('combobox', { name: 'Language' }))
    .toHaveTextContent('English');
});

describe.each([
  ['shadcn', ShadcnLocaleSelect, ShadcnForm], ['mui', MuiLocaleSelect, MuiForm],
] as const)('%s native language selection', (_name, Component, Form) => {
  it('preserves values and keyboard selection through the SDK', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Sample() {
      const [value, setValue] = useState('en-US');
      return (
        <Form label="Preferences" onSubmit={vi.fn()}>
          <Component
            label="Language" locales={locales} value={value} name="locale" required
            description="Choose the interface language"
            onValueChange={(next) => { change(next); setValue(next); }}
          />
        </Form>
      );
    }
    render(<Sample />);
    const control = screen.getByRole('combobox', { name: 'Language' });
    expect(control).toHaveTextContent('English');
    control.focus();
    await user.keyboard('{ArrowDown}');
    const option = await screen.findByRole('option', { name: 'Polish' });
    await user.click(option);
    expect(change).toHaveBeenCalledExactlyOnceWith('pl-PL');
    expect(control).toHaveTextContent('Polish');
    expect(document.querySelector('[name="locale"]')).toHaveValue('pl-PL');
  });

  it('rejects protected writes without changing language itself', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const view = render(
      <Component
        label="Language" locales={locales} value="en-US"
        onValueChange={change} readOnly
      />,
    );
    const control = screen.getByRole('combobox', { name: 'Language' });
    expect(control).toHaveAttribute('aria-readonly', 'true');
    await user.click(control);
    await user.keyboard('{ArrowDown}{Enter}{Escape}');
    expect(change).not.toHaveBeenCalled();
    expect(control).toHaveTextContent('English');
    view.rerender(
      <Component
        label="Language" locales={locales} value="en-US"
        onValueChange={change} disabled
      />,
    );
    expect(document.documentElement.lang).toBe('');
    expect(change).not.toHaveBeenCalled();
  });
});

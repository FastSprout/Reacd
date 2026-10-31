import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { useState } from 'react';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SelectMenu, ReacdProvider } from '../../../index.js';

const items = [
  { value: '42', label: 'Answer', description: 'Canonical opaque ID' },
  { value: 'beta', label: 'Beta' },
  { value: 'disabled', label: 'Disabled choice', disabled: true },
];

function Single() {
  const [value, setValue] = useState('');
  return (
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu
        label="Records"
        items={items}
        value={value}
        onValueChange={setValue}
      />
    </ReacdProvider>
  );
}

it('searches independently and commits an opaque key', async () => {
  const user = userEvent.setup();
  render(<Single />);
  const trigger = screen.getByRole('combobox', { name: 'Records' });
  await user.click(trigger);
  const query = await screen.findByRole('combobox', { name: 'Search Records' });
  await user.type(query, 'answer');
  expect(trigger).toHaveTextContent('Choose an option.');
  await user.click(await screen.findByRole('option', { name: /Answer/ }));
  expect(trigger).toHaveTextContent('Answer');
  await user.click(trigger);
  const reopened = await screen.findByRole('combobox', { name: 'Search Records' });
  expect(reopened).toHaveValue('answer');
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

it('requests a complete array and keeps multiple choices open', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu
        label="Records"
        items={items}
        mode="multiple"
        value={['disabled']}
        onValueChange={change}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: 'Records' }));
  await user.click(await screen.findByRole('option', { name: /Answer/ }));
  expect(change).toHaveBeenCalledExactlyOnceWith(['disabled', '42']);
  expect(screen.getByRole('listbox')).toBeVisible();
});

it('clears disabled old selection and returns trigger focus', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu
        label="Records"
        items={items}
        value="disabled"
        onValueChange={change}
        required
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('button', { name: 'Clear selection: Records' }));
  expect(change).toHaveBeenCalledExactlyOnceWith('');
  expect(screen.getByRole('combobox', { name: 'Records' })).toHaveFocus();
});

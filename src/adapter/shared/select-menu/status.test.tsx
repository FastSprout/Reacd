import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SelectMenu, ReacdProvider } from '../../../index.js';

const base = {
  label: 'Search choices',
  items: [{ value: '42', label: 'Answer' }],
  value: '',
  onValueChange: () => undefined,
};

it('announces empty/custom statuses and exposes associated description', () => {
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu
        {...base}
        items={[]}
        description="Choose a registered record."
        placeholder="Nothing selected"
        emptyMessage="No records found."
        clearable={false}
      />
    </ReacdProvider>,
  );
  expect(screen.getByRole('combobox')).toHaveTextContent('Nothing selected');
  expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
    /Choose a registered record/,
  );
  expect(screen.getByRole('status')).toHaveTextContent('No records found.');
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu {...base} status="loading" loadingMessage="Fetching records." />
    </ReacdProvider>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Fetching records.');
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu {...base} status="error" errorMessage="Records unavailable." />
    </ReacdProvider>,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Records unavailable.');
});

it('opens printable search without closed-trigger selection', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu {...base} onValueChange={change} />
    </ReacdProvider>,
  );
  const trigger = screen.getByRole('combobox', { name: base.label });
  trigger.focus();
  for (const modifier of [{ ctrlKey: true }, { metaKey: true }, { altKey: true }])
    fireEvent.keyDown(trigger, { key: 'a', ...modifier });
  expect(screen.queryByRole('listbox')).toBeNull();
  await user.keyboard('a');
  expect(
    await screen.findByRole('combobox', { name: `Search ${base.label}` }),
  ).toHaveValue('a');
  expect(change).not.toHaveBeenCalled();
});

it('retains value and focused clear on veto', async () => {
  const user = userEvent.setup();
  const change = vi.fn<(value: string) => boolean>(() => false);
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu {...base} value="42" onValueChange={change} />
    </ReacdProvider>,
  );
  const clear = screen.getByRole('button', { name: 'Clear selection: Search choices' });
  clear.focus();
  await user.keyboard(' ');
  expect(change).toHaveBeenCalledExactlyOnceWith('');
  expect(clear).toHaveFocus();
  expect(screen.getByRole('combobox', { name: base.label })).toHaveTextContent(
    'Answer',
  );
});

import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { act, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SelectMenu, ReacdProvider } from '../../../index.js';
import type { SelectMenuProps } from '../../../components/select-menu/index.js';

const items = [
  { value: '42', label: 'Answer' },
  { value: 'old', label: 'Unavailable', disabled: true },
];
const base = {
  label: 'Form records',
  items,
  onValueChange: () => undefined,
  name: 'records',
  required: true,
  readOnly: true,
};

function form() {
  const found = screen.getByRole('form', { name: 'Record form' });
  if (!(found instanceof HTMLFormElement)) throw new Error('Missing form.');
  return found;
}

const emptyCases: readonly SelectMenuProps[] = [
  { ...base, value: '' },
  { ...base, mode: 'multiple', value: [] },
];

it.each(emptyCases)(
  'requires readonly empty mode %# and focuses its trigger',
  (props) => {
    render(
      <form aria-label="Record form">
        <ReacdProvider adapter={activeTestAdapter}>
          <SelectMenu {...props} />
        </ReacdProvider>
      </form>,
    );
    act(() => {
      expect(form().checkValidity()).toBe(false);
    });
    expect(screen.getByRole('combobox', { name: base.label })).toHaveFocus();
    expect(screen.getByRole('alert')).toHaveTextContent('Choose an option');
    expect(screen.getByRole('combobox', { name: base.label })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
);

const completeCases: readonly { properties: SelectMenuProps; data: string[][] }[] = [
  { properties: { ...base, value: 'old' }, data: [['records', 'old']] },
  {
    properties: { ...base, mode: 'multiple', value: ['old', '42'] },
    data: [
      ['records', 'old'],
      ['records', '42'],
    ],
  },
];

it.each(completeCases)(
  'serializes canonical readonly values %# including history',
  ({ properties, data }) => {
    const view = render(
      <form aria-label="Record form">
        <ReacdProvider adapter={activeTestAdapter}>
          <SelectMenu {...properties} />
        </ReacdProvider>
      </form>,
    );
    expect(form().checkValidity()).toBe(true);
    expect(Array.from(new FormData(form()))).toEqual(data);
    view.rerender(
      <form aria-label="Record form">
        <ReacdProvider adapter={activeTestAdapter}>
          <SelectMenu {...properties} disabled />
        </ReacdProvider>
      </form>,
    );
    expect(form().checkValidity()).toBe(true);
    expect(Array.from(new FormData(form()))).toEqual([]);
  },
);

it('omits query from FormData and permits required clear', async () => {
  const user = userEvent.setup();
  const change = vi.fn<(value: string) => void>();
  render(
    <form aria-label="Record form">
      <ReacdProvider adapter={activeTestAdapter}>
        <SelectMenu
          {...base}
          readOnly={false}
          value="42"
          onValueChange={change}
          query="Different text"
          onQueryChange={() => undefined}
        />
      </ReacdProvider>
    </form>,
  );
  expect(Array.from(new FormData(form()))).toEqual([['records', '42']]);
  const trigger = screen.getByRole('combobox', { name: base.label });
  trigger.focus();
  await user.tab();
  await user.keyboard(' ');
  expect(change).toHaveBeenCalledExactlyOnceWith('');
  expect(trigger).toHaveFocus();
  expect(Array.from(new FormData(form()))).toEqual([['records', '42']]);
});

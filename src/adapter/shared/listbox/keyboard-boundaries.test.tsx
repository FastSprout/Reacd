import { fireEvent, render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedListbox } from './listbox.adapter.js';

const items = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'old', label: 'Unavailable', disabled: true },
];

it.each([
  { key: 'Enter', keyCode: 229, isComposing: false },
  { key: ' ', keyCode: 32, isComposing: true },
  { key: 'b', keyCode: 66, isComposing: true },
])('contains composition without premature selection/typeahead: %j', async (signal) => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <SharedListbox label="Choose" items={items} value="a" onValueChange={change} />,
  );
  await user.tab();
  const option = screen.getByRole('option', { name: 'Alpha' });
  fireEvent.keyDown(option, signal);
  expect(option).toHaveFocus();
  expect(change).not.toHaveBeenCalled();
});

it('keeps readonly navigation inspectable without selection requests', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <SharedListbox
      mode="multiple"
      label="Choose"
      items={items}
      value={['a']}
      readOnly
      onValueChange={change}
    />,
  );
  await user.tab();
  await user.keyboard('{ArrowDown}{Enter} ');
  expect(screen.getByRole('option', { name: 'Beta' })).toHaveFocus();
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole('option', { name: 'Alpha' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

it('removes a disabled widget and its Clear control from Tab order', async () => {
  const user = userEvent.setup();
  render(
    <>
      <button>Before</button>
      <SharedListbox
        label="Choose"
        items={items}
        value="a"
        disabled
        onValueChange={vi.fn()}
      />
      <button>After</button>
    </>,
  );
  await user.tab();
  expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
});

it('preserves disabled keys when selecting all available options', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <SharedListbox
      mode="multiple"
      label="Choose"
      items={items}
      value={['old']}
      onValueChange={change}
    />,
  );
  await user.tab();
  await user.keyboard('{Control>}a{/Control}');
  expect(change).toHaveBeenCalledExactlyOnceWith(['old', 'a', 'b']);
});

it('releases SDK Tab behavior and contains disabled direct events', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <SharedListbox
      label="Choose"
      items={items}
      value="a"
      disabled
      onValueChange={change}
    />,
  );
  const list = screen.getByRole('listbox');
  expect(fireEvent.keyDown(list, { key: 'Enter' })).toBe(false);
  expect(fireEvent.keyDown(list, { key: 'Tab' })).toBe(true);
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <SharedListbox label="Choose" items={items} value="a" onValueChange={change} />,
  );
  await user.tab();
  expect(screen.getByRole('option', { name: 'Alpha' })).toHaveFocus();
});

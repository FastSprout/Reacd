import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnListbox } from './listbox.adapter.js';

const items = Object.freeze([
  Object.freeze({ value: '42', label: 'Answer', description: 'Opaque identifier' }),
  Object.freeze({ value: 'next', label: 'Next option' }),
  Object.freeze({ value: 'disabled', label: 'Unavailable', disabled: true }),
]);

it('requests exact values while retained props remain authoritative', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ShadcnListbox label="Choice" items={items} value="42" onValueChange={change} />,
  );
  await user.click(screen.getByRole('option', { name: 'Next option' }));
  expect(change).toHaveBeenCalledExactlyOnceWith('next');
  expect(screen.getByRole('option', { name: 'Answer' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('option', { name: 'Next option' })).toHaveAttribute(
    'aria-selected',
    'false',
  );
});

it('vetoes requests and visibly rejects malformed callback decisions', async () => {
  const user = userEvent.setup();
  const change = vi.fn(() => false);
  const view = render(
    <ShadcnListbox label="Choice" items={items} value="42" onValueChange={change} />,
  );
  await user.click(screen.getByRole('option', { name: 'Next option' }));
  expect(change).toHaveBeenCalledExactlyOnceWith('next');
  expect(screen.getByRole('alert')).toBeVisible();
  view.rerender(
    <ShadcnListbox label="Choice" items={items} value="next" onValueChange={change} />,
  );
  expect(screen.queryByRole('alert')).toBeNull();
});

it('retains value and Clear focus when its explicit request is vetoed', async () => {
  const user = userEvent.setup();
  const change = vi.fn(() => false);
  render(
    <ShadcnListbox label="Choice" items={items} value="42" onValueChange={change} />,
  );
  const clear = screen.getByRole('button', { name: 'Clear selection' });
  await user.click(clear);
  expect(change).toHaveBeenCalledExactlyOnceWith('');
  expect(clear).toHaveFocus();
  expect(screen.getByRole('option', { name: 'Answer' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

it('clears disabled values without permitting new disabled selection', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ShadcnListbox
      mode="multiple"
      label="Choices"
      items={items}
      value={Object.freeze(['disabled', '42'])}
      onValueChange={change}
    />,
  );
  await user.click(screen.getByRole('option', { name: 'Unavailable' }));
  expect(change).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(change).toHaveBeenCalledExactlyOnceWith([]);
  expect(Object.isFrozen(change.mock.calls[0]?.[0])).toBe(true);
});

it.each([
  { readOnly: true },
  { disabled: true },
  { status: 'loading' as const },
  { status: 'error' as const },
])('protects selection requests: %j', async (props) => {
  const user = userEvent.setup();
  const change = vi.fn();
  render(
    <ShadcnListbox
      label="Choice"
      items={items}
      value="42"
      onValueChange={change}
      {...props}
    />,
  );
  await user.click(screen.getByRole('option', { name: 'Next option' }));
  await user.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(change).not.toHaveBeenCalled();
});

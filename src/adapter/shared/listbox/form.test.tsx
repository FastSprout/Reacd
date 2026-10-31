import { useState } from 'react';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SharedListbox } from './listbox.adapter.js';

const items = [
  { value: '42', label: 'Answer' },
  { value: 'old', label: 'Unavailable', disabled: true },
] as const;

it('selects with Enter/Space without implicitly submitting its form', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const submit = vi.fn();
  render(
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <SharedListbox
        label="Keyboard form"
        items={[...items, { value: 'b', label: 'Beta' }]}
        value="42"
        onValueChange={change}
      />
      <button type="submit">Save</button>
    </form>,
  );
  await user.tab();
  await user.keyboard('{ArrowDown}{Enter} ');
  expect(change).toHaveBeenCalledTimes(2);
  expect(change).toHaveBeenLastCalledWith('b');
  expect(submit).not.toHaveBeenCalled();
});

it('serializes single and repeated multiple keys, including disabled values', () => {
  const { container } = render(
    <form>
      <SharedListbox
        label="Single"
        items={items}
        value="42"
        name="single"
        readOnly
        onValueChange={vi.fn()}
      />
      <SharedListbox
        mode="multiple"
        label="Multiple"
        items={items}
        value={['old', '42']}
        name="multiple"
        onValueChange={vi.fn()}
      />
      <SharedListbox
        label="Empty single"
        items={[]}
        value=""
        name="empty"
        onValueChange={vi.fn()}
      />
      <SharedListbox
        mode="multiple"
        label="Empty multiple"
        items={[]}
        value={[]}
        name="emptyMultiple"
        onValueChange={vi.fn()}
      />
      <SharedListbox
        label="Disabled"
        items={items}
        value="42"
        name="disabled"
        disabled
        required
        onValueChange={vi.fn()}
      />
    </form>,
  );
  const form = container.querySelector('form');
  if (form === null) throw new Error('Expected native form.');
  expect([...new FormData(form)]).toEqual([
    ['single', '42'],
    ['multiple', 'old'],
    ['multiple', '42'],
    ['empty', ''],
  ]);
});

it.each([false, true])(
  'validates required emptiness including readonly=%s',
  async (readOnly) => {
    const user = userEvent.setup();
    const submit = vi.fn();
    const { rerender } = render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <SharedListbox
          label="Required"
          items={items}
          value=""
          required
          readOnly={readOnly}
          onValueChange={vi.fn()}
        />
        <button type="submit">Save</button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent('Select at least one option.');
    expect(screen.getByRole('listbox').contains(document.activeElement)).toBe(true);
    rerender(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <SharedListbox
          label="Required"
          items={items}
          value="42"
          required
          readOnly={readOnly}
          onValueChange={vi.fn()}
        />
        <button type="submit">Save</button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(submit).toHaveBeenCalledOnce();
    expect(screen.queryByRole('alert')).toBeNull();
  },
);

it('requests one initial value on reset without canceling other fields', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  function Example() {
    const [value, setValue] = useState<readonly string[]>(['42']);
    return (
      <form>
        <SharedListbox
          mode="multiple"
          label="Reset"
          items={items}
          value={value}
          onValueChange={(next) => {
            change(next);
            setValue(next);
          }}
        />
        <input aria-label="Other" defaultValue="Initial" />
        <button type="button" onClick={() => setValue([])}>
          Replace
        </button>
        <button type="reset">Reset form</button>
      </form>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('button', { name: 'Replace' }));
  await user.type(screen.getByRole('textbox', { name: 'Other' }), 'Edited');
  await user.click(screen.getByRole('button', { name: 'Reset form' }));
  expect(change).toHaveBeenCalledExactlyOnceWith(['42']);
  expect(screen.getByRole('option', { name: 'Answer' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('textbox', { name: 'Other' })).toHaveValue('Initial');
});

it('refuses reset that would newly restore a disabled initial key', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  function Example() {
    const [value, setValue] = useState('old');
    return (
      <form>
        <SharedListbox
          label="Protected reset"
          items={items}
          value={value}
          onValueChange={change}
        />
        <button type="button" onClick={() => setValue('42')}>
          Replace
        </button>
        <button type="reset">Reset</button>
      </form>
    );
  }
  render(<Example />);
  await user.click(screen.getByRole('button', { name: 'Replace' }));
  await user.click(screen.getByRole('button', { name: 'Reset' }));
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole('option', { name: 'Answer' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('alert')).toBeVisible();
});

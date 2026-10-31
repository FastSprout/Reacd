import { render, screen, within } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { FieldMetadataContext } from '../../../renderer/form-field/field-metadata.js';
import { SharedListbox } from './listbox.adapter.js';

const items = [
  { value: '42', label: 'Answer' },
  { value: 'b', label: 'Beta' },
];
const metadata = {
  name: 'inherited',
  required: false,
  disabled: false,
  error: '',
  descriptionIds: [],
};

it('inherits name and reads grouped descriptions and errors', () => {
  const view = render(
    <form>
      <p id="group-help">Group help</p>
      <p id="group-error">Server rejected selection</p>
      <FieldMetadataContext.Provider
        value={{
          ...metadata,
          error: 'Server rejected selection',
          descriptionIds: ['group-help', 'group-error', 'group-help'],
        }}
      >
        <SharedListbox
          label="Control"
          items={items}
          value="42"
          description="Local help"
          onValueChange={vi.fn()}
        />
      </FieldMetadataContext.Provider>
    </form>,
  );
  const list = screen.getByRole('listbox', { name: 'Control' });
  expect(list).toHaveAttribute('aria-invalid', 'true');
  expect(list).toHaveAccessibleDescription(/Group help.*Server rejected.*Local help/);
  const ids = list.getAttribute('aria-describedby')?.split(' ');
  expect(ids?.filter((id) => id === 'group-help')).toHaveLength(1);
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Expected form.');
  expect([...new FormData(form)]).toEqual([['inherited', '42']]);
});

it('allows explicit names while preserving inherited feedback', () => {
  const view = render(
    <form>
      <p id="group-help">Group help</p>
      <FieldMetadataContext.Provider
        value={{ ...metadata, descriptionIds: ['group-help'] }}
      >
        <SharedListbox
          label="Control"
          items={items}
          value="42"
          name="explicit"
          onValueChange={vi.fn()}
        />
      </FieldMetadataContext.Provider>
    </form>,
  );
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Expected form.');
  expect([...new FormData(form)]).toEqual([['explicit', '42']]);
  expect(screen.getByRole('listbox')).toHaveAccessibleDescription(/Group help/);
});

it('cannot reenable an outer disabled field through local false', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const view = render(
    <form>
      <FieldMetadataContext.Provider value={metadata}>
        <SharedListbox
          label="Control"
          items={items}
          value="42"
          disabled={false}
          onValueChange={change}
        />
      </FieldMetadataContext.Provider>
    </form>,
  );
  await user.click(screen.getByRole('option', { name: 'Beta' }));
  expect(change).toHaveBeenCalledExactlyOnceWith('b');
  change.mockClear();
  view.rerender(
    <form>
      <FieldMetadataContext.Provider value={{ ...metadata, disabled: true }}>
        <SharedListbox
          label="Control"
          items={items}
          value="42"
          disabled={false}
          onValueChange={change}
        />
      </FieldMetadataContext.Provider>
    </form>,
  );
  await user.click(screen.getByRole('option', { name: 'Beta' }));
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Clear selection' })).toBeDisabled();
  expect(screen.getByRole('listbox')).toHaveAttribute('aria-disabled', 'true');
  const form = view.container.querySelector('form');
  if (form === null) throw new Error('Expected form.');
  expect([...new FormData(form)]).toEqual([]);
});

it.each([undefined, false])(
  'keeps readonly required semantics with explicit override %s',
  async (required) => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <FieldMetadataContext.Provider value={{ ...metadata, required: true }}>
          <SharedListbox
            label="Control"
            items={items}
            value=""
            readOnly
            required={required}
            onValueChange={vi.fn()}
          />
        </FieldMetadataContext.Provider>
        <button type="submit">Save</button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Save' }));
    if (required === false) expect(submit).toHaveBeenCalledOnce();
    else {
      expect(submit).not.toHaveBeenCalled();
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Select at least one option.',
      );
      expect(
        within(screen.getByRole('listbox')).getByRole('option', { name: 'Answer' }),
      ).toHaveAttribute('aria-selected', 'false');
    }
  },
);

import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import {
  act,
  fireEvent,
  render,
  screen,
} from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SelectMenu, ReacdProvider } from '../../../index.js';
import { FieldMetadataContext } from '../../../renderer/form-field/field-metadata.js';

const metadata = {
  name: 'inherited',
  required: true,
  disabled: false,
  error: '',
  descriptionIds: ['scope-description'],
};
const base = {
  label: 'Scoped records',
  items: [{ value: '42', label: 'Answer' }],
  value: '',
  onValueChange: () => undefined,
};

it('disables an already portaled popup through containing field metadata', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  function Scene({ disabled }: { disabled: boolean }) {
    return (
      <ReacdProvider adapter={activeTestAdapter}>
        <FieldMetadataContext value={{ ...metadata, disabled }}>
          <SelectMenu {...base} disabled={false} onValueChange={change} />
        </FieldMetadataContext>
      </ReacdProvider>
    );
  }
  const view = render(<Scene disabled={false} />);
  await user.click(screen.getByRole('combobox', { name: base.label }));
  const option = await screen.findByRole('option', { name: 'Answer' });
  view.rerender(<Scene disabled />);
  expect(screen.getByRole('combobox', { name: base.label })).toBeDisabled();
  fireEvent.click(option);
  expect(change).not.toHaveBeenCalled();
  expect(screen.queryByRole('listbox')).toBeNull();
});

it('inherits form defaults, descriptions and outer error associations', () => {
  const view = render(
    <form aria-label="Scoped form">
      <span id="scope-description">Outer description.</span>
      <ReacdProvider adapter={activeTestAdapter}>
        <FieldMetadataContext value={metadata}>
          <SelectMenu {...base} description="Local description." />
        </FieldMetadataContext>
      </ReacdProvider>
    </form>,
  );
  const form = screen.getByRole('form');
  if (!(form instanceof HTMLFormElement)) throw new Error('Missing form.');
  expect(form.querySelector('.reacd-select-menu-validation')).toHaveAttribute(
    'required',
  );
  act(() => expect(form.checkValidity()).toBe(false));
  expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
    /Outer description.*Local description/,
  );
  expect(Array.from(new FormData(form))).toEqual([['inherited', '']]);
  view.rerender(
    <form aria-label="Scoped form">
      <span id="scope-description">Outer error.</span>
      <ReacdProvider adapter={activeTestAdapter}>
        <FieldMetadataContext value={{ ...metadata, error: 'Outer error.' }}>
          <SelectMenu {...base} value="42" name="explicit" required={false} />
        </FieldMetadataContext>
      </ReacdProvider>
    </form>,
  );
  expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByRole('combobox')).toHaveAccessibleDescription(/Outer error/);
  expect(Array.from(new FormData(form))).toEqual([['explicit', '42']]);
});

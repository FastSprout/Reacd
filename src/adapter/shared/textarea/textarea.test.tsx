import {
  act,
  fireEvent,
  render,
  screen,
} from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SharedTextarea } from './textarea.adapter.js';
import { SharedFormField } from '../form-field/form-field.adapter.js';

describe('enterprise Textarea', () => {
  it('requests controlled newline/paste edits and declines excess', async () => {
    const change = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <SharedTextarea
        label="Notes"
        value="old"
        description="Published notes"
        onValueChange={change}
        maxLength={8}
      />,
    );
    const control = screen.getByRole('textbox', { name: 'Notes' });
    expect(control).toHaveAccessibleDescription('Published notes');
    fireEvent.change(control, { target: { value: 'new\ntext' } });
    expect(change).toHaveBeenLastCalledWith('new\ntext');
    expect(control).toHaveValue('old');
    fireEvent.change(control, { target: { value: 'too many characters' } });
    expect(change).toHaveBeenCalledTimes(1);
    rerender(<SharedTextarea label="Notes" value="" onValueChange={change} />);
    await user.click(control);
    await user.paste('pasted');
    expect(change).toHaveBeenLastCalledWith('pasted');
  });

  it.each([{ disabled: true }, { readOnly: true }])(
    'rejects protected synthetic writes: %j',
    (protection) => {
      const change = vi.fn();
      render(
        <SharedTextarea
          label="Protected"
          value="kept"
          {...protection}
          onValueChange={change}
        />,
      );
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'changed' } });
      expect(change).not.toHaveBeenCalled();
      expect(screen.getByRole('textbox')).toHaveValue('kept');
    },
  );

  it('validates readonly required/minimum and submits canonical data', () => {
    const { container, rerender } = render(
      <form>
        <SharedTextarea
          label="Notes"
          value=""
          onValueChange={vi.fn()}
          readOnly
          required
          minLength={4}
          name="notes"
        />
      </form>,
    );
    const form = container.querySelector('form');
    if (form === null) throw new Error('Missing form');
    act(() => {
      expect(form.checkValidity()).toBe(false);
    });
    expect(screen.getByRole('textbox')).toHaveFocus();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a value.');
    rerender(
      <form>
        <SharedTextarea
          label="Notes"
          value="abc"
          onValueChange={vi.fn()}
          readOnly
          minLength={4}
          name="notes"
        />
      </form>,
    );
    act(() => {
      expect(form.checkValidity()).toBe(false);
    });
    expect(screen.getByRole('alert')).toHaveTextContent('Enter at least 4 characters.');
    expect([...new FormData(form)]).toEqual([['notes', 'abc']]);
    rerender(
      <form>
        <SharedTextarea
          label="Notes"
          value="valid"
          onValueChange={vi.fn()}
          readOnly
          minLength={4}
          name="notes"
        />
      </form>,
    );
    expect(form.checkValidity()).toBe(true);
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('inherits metadata and permits optional empty drafts', () => {
    const { container, rerender } = render(
      <form>
        <SharedFormField
          name="field"
          required
          description="Field description"
          error="Rejected by host"
        >
          <SharedTextarea
            label="Notes"
            description="Own description"
            value=""
            required={false}
            name="explicit"
            onValueChange={vi.fn()}
          />
        </SharedFormField>
      </form>,
    );
    const control = screen.getByRole('textbox');
    expect(control).toHaveAttribute('name', 'explicit');
    expect(control).not.toHaveAttribute('required');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toHaveAccessibleDescription(
      'Field description Rejected by host Own description',
    );
    const form = container.querySelector('form');
    if (form === null) throw new Error('Missing form');
    expect(form.checkValidity()).toBe(false);
    rerender(
      <form>
        <SharedFormField name="field" disabled required>
          <SharedTextarea
            label="Notes"
            value="canonical"
            disabled={false}
            onValueChange={vi.fn()}
          />
        </SharedFormField>
      </form>,
    );
    expect(control).toBeDisabled();
    expect([...new FormData(form)]).toEqual([]);
    expect(form.checkValidity()).toBe(true);
    rerender(
      <form>
        <SharedTextarea label="Notes" value="" minLength={4} onValueChange={vi.fn()} />
      </form>,
    );
    expect(form.checkValidity()).toBe(true);
  });
});

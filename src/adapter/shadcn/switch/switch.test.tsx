import { act, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ShadcnSwitch } from './switch.adapter.js';
import { ShadcnFormField } from '../form-field/form-field.adapter.js';

describe('enterprise Switch', () => {
  it('requests controlled pointer, label and keyboard writes', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ShadcnSwitch
        label="Publish"
        description="Visible to everyone"
        checked={false}
        onCheckedChange={change}
      />,
    );
    const control = screen.getByRole('switch', { name: 'Publish' });
    expect(control).toHaveAccessibleDescription('Visible to everyone');
    await user.click(control);
    expect(change).toHaveBeenLastCalledWith(true);
    expect(control).toHaveAttribute('aria-checked', 'false');
    await user.click(screen.getByText('Publish'));
    expect(change).toHaveBeenCalledTimes(2);
    control.focus();
    await user.keyboard(' {Enter}');
    expect(change).toHaveBeenCalledTimes(4);
  });

  it.each([{ disabled: true }, { readOnly: true }, { loading: true }])(
    'prevents protected writes: %j',
    async (protection) => {
      const user = userEvent.setup();
      const change = vi.fn();
      render(
        <ShadcnSwitch
          label="Protected"
          checked
          onCheckedChange={change}
          {...protection}
        />,
      );
      const control = screen.getByRole('switch');
      fireEvent.click(control);
      await user.click(screen.getByText('Protected'));
      expect(change).not.toHaveBeenCalled();
      if ('loading' in protection) {
        expect(control).toHaveAttribute('aria-busy', 'true');
        expect(screen.getByRole('status')).toHaveTextContent('Updating Protected');
      }
    },
  );

  it('validates readonly required state and submits canonical data', () => {
    const { container, rerender } = render(
      <form>
        <ShadcnSwitch
          label="Terms"
          checked={false}
          required
          readOnly
          name="terms"
          onCheckedChange={vi.fn()}
        />
      </form>,
    );
    const form = container.querySelector('form');
    if (form === null) throw new Error('Missing form');
    act(() => {
      expect(form.checkValidity()).toBe(false);
    });
    expect(screen.getByRole('switch')).toHaveFocus();
    expect(screen.getByRole('alert')).toHaveTextContent('Enable this setting');
    expect([...new FormData(form)]).toEqual([]);
    rerender(
      <form>
        <ShadcnSwitch
          label="Terms"
          checked
          required
          readOnly
          name="terms"
          value="accepted"
          onCheckedChange={vi.fn()}
        />
      </form>,
    );
    expect(form.checkValidity()).toBe(true);
    expect([...new FormData(form)]).toEqual([['terms', 'accepted']]);
    expect(screen.queryByRole('alert')).toBeNull();
    rerender(
      <form>
        <ShadcnSwitch
          label="Terms"
          checked
          disabled
          name="terms"
          onCheckedChange={vi.fn()}
        />
      </form>,
    );
    expect([...new FormData(form)]).toEqual([]);
  });

  it('inherits field flags and descriptions with explicit overrides', () => {
    const { container, rerender } = render(
      <form>
        <ShadcnFormField
          name="inherited"
          required
          description="Field description"
          error="Server rejected"
        >
          <ShadcnSwitch label="Terms" checked onCheckedChange={vi.fn()} />
        </ShadcnFormField>
      </form>,
    );
    const form = container.querySelector('form');
    if (form === null) throw new Error('Missing form');
    expect([...new FormData(form)]).toEqual([['inherited', 'on']]);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('switch')).toHaveAccessibleDescription(
      'Field description Server rejected',
    );
    rerender(
      <form>
        <ShadcnFormField name="field" required disabled>
          <ShadcnSwitch
            label="Terms"
            checked={false}
            required={false}
            disabled={false}
            name="explicit"
            onCheckedChange={vi.fn()}
          />
        </ShadcnFormField>
      </form>,
    );
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(form.checkValidity()).toBe(true);
    expect([...new FormData(form)]).toEqual([]);
  });
});

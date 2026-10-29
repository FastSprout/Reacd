import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShadcnFormField } from './form-field.adapter.js';

describe('FormField semantic validation', () => {
  it('associates feedback and focuses a visible control on invalid submission', () => {
    const { container, rerender } = render(
      <form>
        <ShadcnFormField
          name="notes"
          label="Details"
          description="Public"
          hint="Optional context"
          help="Explain"
          error="  Rejected  "
          required
        >
          <input hidden aria-label="Bridge" />
          <input aria-label="Hidden parent" hidden />
          <input aria-label="Disabled" disabled />
          <input aria-label="Notes" />
        </ShadcnFormField>
      </form>,
    );
    const group = screen.getByRole('group', { name: 'Details *' });
    expect(group).toHaveAccessibleDescription('Public Optional context Rejected');
    expect(screen.queryByText('Explain')).toBeNull();
    expect(screen.getByRole('alert')).toHaveTextContent('Rejected');
    expect(container.querySelector('form')?.checkValidity()).toBe(false);
    expect(screen.getByLabelText('Notes')).toHaveFocus();
    rerender(
      <form>
        <ShadcnFormField name="notes" help="Explain" error=" ">
          <input aria-label="Notes" />
        </ShadcnFormField>
      </form>,
    );
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByText('Explain')).toBeVisible();
    expect(container.querySelector('form')?.checkValidity()).toBe(true);
  });

  it('focuses empty groups and excludes disabled scopes', () => {
    const { container, rerender } = render(
      <form>
        <ShadcnFormField name="empty" error="Invalid">
          {null}
        </ShadcnFormField>
      </form>,
    );
    expect(container.querySelector('form')?.checkValidity()).toBe(false);
    expect(screen.getByRole('group')).toHaveFocus();
    rerender(
      <form>
        <ShadcnFormField name="empty" disabled error="Invalid">
          <input name="value" defaultValue="secret" />
        </ShadcnFormField>
      </form>,
    );
    const form = container.querySelector('form');
    if (!(form instanceof HTMLFormElement)) throw new Error('Missing form');
    expect(form.checkValidity()).toBe(true);
    expect([...new FormData(form)]).toEqual([]);
    const input = container.querySelector('input');
    if (input === null) throw new Error('Missing input');
    fireEvent.invalid(input);
  });
});

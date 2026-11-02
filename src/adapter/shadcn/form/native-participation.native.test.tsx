import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnForm } from './form.adapter.js';
import { ShadcnPinInput } from '../pin-input/pin-input.adapter.js';
import { ShadcnInputNumber } from '../input-number/input-number.adapter.js';
import { ShadcnSubmitButton } from '../submit-button/submit-button.adapter.js';

it.each(['pin', 'number'])('keeps closed %s fields excluded inside pending Forms',
  async (kind) => {
    const submit = vi.fn();
    function Fields({ pending }: { pending: boolean }) {
      return <ShadcnForm label="Fields" onSubmit={submit} submitting={pending}>
        {kind === 'pin' ? <ShadcnPinInput label="Included" name="included"
          value="001234" required onValueChange={vi.fn()} />
          : <ShadcnInputNumber label="Included" name="included"
            value={1.5} step={0.5} required onValueChange={vi.fn()} />}
        <PortalActiveContext value={false}>
          {kind === 'pin' ? <ShadcnPinInput label="Closed" name="closed"
            value="" required onValueChange={vi.fn()} />
            : <ShadcnInputNumber label="Closed" name="closed"
              value={null} required onValueChange={vi.fn()} />}
        </PortalActiveContext>
        <ShadcnSubmitButton label="Save" />
      </ShadcnForm>;
    }
    const view = render(<Fields pending />);
    const form = screen.getByRole('form', { name: 'Fields' });
    if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form');
    expect([...new FormData(form)]).toEqual([
      ['included', kind === 'pin' ? '001234' : '1.5'],
    ]);
    expect(screen.getByRole('textbox', { name: 'Included' })).not.toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Closed' })).toBeDisabled();
    view.rerender(<Fields pending={false} />);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(submit).toHaveBeenCalledExactlyOnceWith());
  });

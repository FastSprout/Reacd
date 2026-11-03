import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnForm } from '../form/form.adapter.js';
import { ShadcnSelect } from './select.adapter.js';

it('separates native multiple option labels and descriptions', async () => {
  const user = userEvent.setup();
  const change = vi.fn<(value: readonly string[]) => void>();
  const label = 'Regional approval and international logistics coordination';
  const content = (value: readonly string[]) => (
    <ShadcnForm label="Selection" onSubmit={() => undefined}>
      <ShadcnSelect
        mode="multiple"
        label="Included statuses"
        name="included"
        value={value}
        onValueChange={change}
        items={[
          { value: 'draft', label: 'Draft' },
          { value: 'review', label, description: 'Review before release.' },
        ]}
      />
    </ShadcnForm>
  );
  const view = render(content(['draft']));
  const trigger = screen.getByRole('combobox', { name: 'Included statuses' });
  await user.click(trigger);
  await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
  const option = await screen.findByRole('option', { name: label });
  expect(option).toHaveAccessibleDescription('Review before release.');
  await user.click(option);
  expect(change).toHaveBeenCalledExactlyOnceWith(['draft', 'review']);
  await user.keyboard('{Escape}');
  view.rerender(content(['draft', 'review']));
  const form = screen.getByRole('form', { name: 'Selection' });
  if (!(form instanceof HTMLFormElement)) throw new Error('Expected native form.');
  expect(new FormData(form).getAll('included')).toEqual(['draft', 'review']);
});

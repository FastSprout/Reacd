import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { MuiRadioGroup } from './radio-group.adapter.js';
it('uses Material RadioGroup and isolated value callbacks', async () => {
  const change = vi.fn<(value: string) => void>();
  render(
    <MuiRadioGroup
      label="Role"
      value="reader"
      onValueChange={change}
      items={[
        { value: 'reader', label: 'Reader' },
        { value: 'editor', label: 'Editor' },
      ]}
    />,
  );
  expect(screen.getByRole('radiogroup', { name: 'Role' }).className).toContain(
    'MuiRadioGroup-root',
  );
  await userEvent.click(screen.getByRole('radio', { name: 'Editor' }));
  expect(change).toHaveBeenCalledWith('editor');
});

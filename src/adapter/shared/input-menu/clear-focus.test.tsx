import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { useState } from 'react';
import { render, screen } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { InputMenu, ReacdProvider } from '../../../index.js';

function Example() {
  const [value, setValue] = useState('Custom place');
  return (
    <ReacdProvider adapter={activeTestAdapter}>
      <InputMenu
        label="Clear destination"
        items={[]}
        value={value}
        onValueChange={setValue}
      />
    </ReacdProvider>
  );
}

it('returns input focus after accepted clear removes its button', async () => {
  const user = userEvent.setup();
  render(<Example />);
  const input = screen.getByRole('combobox', { name: 'Clear destination' });
  await user.click(
    screen.getByRole('button', { name: 'Clear text: Clear destination' }),
  );
  expect(input).toHaveValue('');
  expect(input).toHaveFocus();
});

it('preserves clear focus after an explicit host veto', async () => {
  const user = userEvent.setup();
  const change = vi.fn<(value: string) => boolean>(() => false);
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <InputMenu
        label="Clear destination"
        items={[]}
        value="Retained text"
        onValueChange={change}
      />
    </ReacdProvider>,
  );
  const clear = screen.getByRole('button', { name: 'Clear text: Clear destination' });
  await user.click(clear);
  expect(change).toHaveBeenCalledExactlyOnceWith('');
  expect(clear).toHaveFocus();
  expect(screen.getByRole('combobox', { name: 'Clear destination' })).toHaveValue(
    'Retained text',
  );
});

it('requests clear once and retains an open popup when the host vetoes', async () => {
  const user = userEvent.setup();
  const change = vi.fn<(value: string) => boolean>(() => false);
  const open = vi.fn<(value: boolean) => boolean>(() => false);
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <InputMenu
        label="Clear destination"
        items={[]}
        value="Retained text"
        onValueChange={change}
        open
        onOpenChange={open}
      />
    </ReacdProvider>,
  );
  await user.click(screen.getByText('Clear text', { exact: true }));
  expect(change).toHaveBeenCalledExactlyOnceWith('');
  expect(open).not.toHaveBeenCalled();
  expect(screen.getByRole('combobox', { name: 'Clear destination' })).toHaveValue(
    'Retained text',
  );
  expect(screen.getByRole('listbox')).toBeVisible();
});

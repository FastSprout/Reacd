import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Combobox } from '@base-ui/react/combobox';
import { expect, it, vi } from 'vitest';
import { SelectMenu, ReacdProvider } from '../../../index.js';
import { EscapeScopeContext } from '../../../renderer/theme/escape-context.js';
import { createEscapeScope } from '../../../renderer/theme/escape-scope.js';
import { SelectMenuRoot } from './select-menu-root.js';
import { useSelectMenu } from './use-select-menu.js';

const base = {
  label: 'Native records',
  items: [{ value: '42', label: 'Answer' }],
  value: '42',
  onValueChange: () => undefined,
};

it('declines SDK disclosure without opening a private popup', async () => {
  const user = userEvent.setup();
  const open = vi.fn<(next: boolean) => boolean>(() => false);
  render(
    <ReacdProvider adapter={shadcnAdapter}>
      <SelectMenu {...base} open={false} onOpenChange={open} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: base.label }));
  await waitFor(() => expect(open).toHaveBeenCalledExactlyOnceWith(true));
  expect(screen.queryByRole('listbox')).toBeNull();
});

it('normalizes native nullable clear to the canonical empty single value', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const query = vi.fn();
  function NativeClear() {
    const properties = {
      ...base,
      query: 'Independent search',
      onQueryChange: query,
      onValueChange: change,
    };
    const model = useSelectMenu(properties);
    return (
      <SelectMenuRoot properties={properties} model={model}>
        <Combobox.Clear>Native clear</Combobox.Clear>
      </SelectMenuRoot>
    );
  }
  render(<NativeClear />);
  await user.click(screen.getByRole('button', { name: 'Native clear' }));
  expect(change).toHaveBeenCalledExactlyOnceWith('');
  expect(query).not.toHaveBeenCalled();
});

it('registers inner Escape without changing the selected-value channel', () => {
  const scope = createEscapeScope();
  const disclosure = vi.fn();
  const change = vi.fn();
  renderHook(
    () =>
      useSelectMenu({
        ...base,
        open: true,
        onOpenChange: disclosure,
        onValueChange: change,
      }),
    {
      wrapper: ({ children }) => (
        <EscapeScopeContext value={scope}>{children}</EscapeScopeContext>
      ),
    },
  );
  act(() => expect(scope.dismiss()).toBe(true));
  expect(disclosure).toHaveBeenCalledExactlyOnceWith(false);
  expect(change).not.toHaveBeenCalled();
});

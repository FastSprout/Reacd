import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { DirectionProvider } from '@radix-ui/react-direction';
import { expect, it, vi } from 'vitest';
import {
  PortalActiveContext,
  PortalHostContext,
} from '../../../renderer/theme/portal-context.js';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';
import { ShadcnThemeContext } from '../surface/theme-context.js';
import { ShadcnInputMenu } from './input-menu.adapter.js';

const items = [
  { value: 'a', label: 'Alpha', description: 'Kraków' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
];

it('keeps text editable while loading and rejects stale suggestions', async () => {
  function Example() {
    const [value, change] = useState('');
    return (
      <ShadcnInputMenu
        label="City"
        value={value}
        onValueChange={change}
        items={items}
        status="loading"
        loadingMessage="Finding cities"
      />
    );
  }
  render(<Example />);
  const input = screen.getByRole('combobox', { name: 'City' });
  await userEvent.type(input, 'Vienna');
  expect(input).toHaveValue('Vienna');
  expect(input).toHaveAttribute('aria-busy', 'true');
  expect(screen.getByRole('status')).toHaveTextContent('Finding cities');
  expect(screen.queryByRole('option')).toBeNull();
});

it('renders externally ordered results and custom empty/error messages', async () => {
  const view = render(
    <ShadcnInputMenu
      label="City"
      value=""
      items={items}
      visibleValues={['b', 'a']}
      onValueChange={vi.fn()}
      open
      onOpenChange={vi.fn()}
    />,
  );
  await screen.findByRole('option', { name: 'Beta' });
  expect(screen.getAllByRole('option').map((item) => item.textContent)).toEqual([
    'Beta',
    'AlphaKraków',
  ]);
  view.rerender(
    <ShadcnInputMenu
      label="City"
      value=""
      items={[]}
      emptyMessage="No cities"
      onValueChange={vi.fn()}
      open
      onOpenChange={vi.fn()}
    />,
  );
  expect(screen.getByText('No cities')).toBeVisible();
  view.rerender(
    <ShadcnInputMenu
      label="City"
      value=""
      items={[]}
      status="error"
      errorMessage="Cities unavailable"
      onValueChange={vi.fn()}
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Cities unavailable');
  view.rerender(
    <ShadcnInputMenu
      label="City"
      value=""
      items={[]}
      status="loading"
      onValueChange={vi.fn()}
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Loading suggestions.');
  view.rerender(
    <ShadcnInputMenu
      label="City"
      value=""
      items={[]}
      status="error"
      onValueChange={vi.fn()}
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent(
    'Suggestions could not be loaded.',
  );
});

it('keeps readonly inspection and omits only disabled native data', async () => {
  const write = vi.fn();
  const view = render(
    <form>
      <ShadcnInputMenu
        label="City"
        value="Alpha"
        readOnly
        items={items}
        name="city"
        onValueChange={write}
      />
    </form>,
  );
  const input = screen.getByRole('combobox', { name: 'City' });
  await userEvent.click(input);
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(write).not.toHaveBeenCalled();
  expect(input).toHaveAttribute('readonly');
  view.rerender(
    <form>
      <ShadcnInputMenu
        label="City"
        value="Alpha"
        disabled
        items={items}
        name="city"
        clearable={false}
        onValueChange={write}
      />
    </form>,
  );
  expect(screen.getByRole('combobox', { name: 'City' })).toBeDisabled();
  const form = view.container.querySelector('form');
  if (!form) throw new Error('Missing test form.');
  expect(Array.from(new FormData(form))).toEqual([]);
});

it('uses the native scoped portal with theme and RTL direction', async () => {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const view = render(
    <DirectionProvider dir="rtl">
      <PortalHostContext value={host}>
        <ShadcnThemeContext value={{ color: 'red' }}>
          <ShadcnInputMenu
            label="City"
            value=""
            items={items}
            onValueChange={vi.fn()}
          />
        </ShadcnThemeContext>
      </PortalHostContext>
    </DirectionProvider>,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'City' }));
  const list = await within(host).findByRole('listbox');
  const popup = list.closest('[data-slot="combobox-content"]');
  expect(popup).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  expect(popup).toHaveAttribute('dir', 'rtl');
  view.unmount();
  host.remove();
});

it.each(['inactive', 'pending'] as const)(
  'closes %s portals with the corresponding native field participation',
  async (reason) => {
    const write = vi.fn();
    const contents = (protectedScope: boolean) => (
      <PortalActiveContext value={!(protectedScope && reason === 'inactive')}>
        <FormPendingContext value={protectedScope && reason === 'pending'}>
          <form>
            <ShadcnInputMenu
              label="City"
              value="Alpha"
              items={items}
              name="city"
              onValueChange={write}
            />
          </form>
        </FormPendingContext>
      </PortalActiveContext>
    );
    const view = render(contents(false));
    await userEvent.click(screen.getByRole('combobox', { name: 'City' }));
    await screen.findByRole('listbox');
    view.rerender(contents(true));
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    const input = screen.getByRole('combobox', { name: 'City' });
    expect(input).toHaveValue('Alpha');
    expect(input).toHaveProperty('disabled', reason === 'inactive');
    const form = view.container.querySelector('form');
    if (!form) throw new Error('Missing test form.');
    expect(Array.from(new FormData(form))).toEqual(
      reason === 'inactive' ? [] : [['city', 'Alpha']],
    );
    await userEvent.type(input, ' changed');
    expect(write).not.toHaveBeenCalled();
    expect(input).toHaveValue('Alpha');
  },
);

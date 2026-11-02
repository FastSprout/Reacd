import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnSelect } from './select.adapter.js';

const items = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two', disabled: true },
];
it('uses SDK selection popup and controlled single selection', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnSelect
      label="Choice"
      items={items}
      value=""
      onValueChange={change}
      clearable
      description="Choose one"
    />,
  );
  const control = screen.getByRole('combobox', { name: 'Choice' });
  expect(control.className).toContain('border-input');
  await userEvent.click(control);
  expect(screen.getByRole('listbox', { name: 'Choice' })).toBeVisible();
  await userEvent.click(await screen.findByRole('option', { name: 'One' }));
  expect(change).toHaveBeenCalledWith('one');
  await userEvent.click(screen.getByRole('button', { name: 'Clear Choice' }));
  expect(change).toHaveBeenCalledWith('');
  view.rerender(
    <ShadcnSelect
      label="Choice"
      items={items}
      value="one"
      onValueChange={change}
      readOnly
    />,
  );
  expect(control).toHaveAttribute('aria-readonly', 'true');
});
it('uses SDK multiple selection and native controlled values', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnSelect
      label="Choices"
      mode="multiple"
      value={[]}
      items={items}
      onValueChange={change}
      clearable
      required
    />,
  );
  screen.getByRole('combobox', { name: 'Choices' }).focus();
  await userEvent.keyboard('{ArrowDown}');
  await userEvent.click(await screen.findByRole('option', { name: 'One' }));
  expect(change).toHaveBeenCalledWith(['one']);
  view.rerender(
    <ShadcnSelect
      label="Choices"
      mode="multiple"
      value={['one']}
      items={items}
      onValueChange={change}
      clearable
      required
    />,
  );
  await userEvent.click(await screen.findByRole('option', { name: 'One' }));
  expect(change).toHaveBeenCalledWith([]);
  await userEvent.keyboard('{Escape}');
  await userEvent.click(screen.getByRole('button', { name: 'Clear Choices' }));
  expect(change).toHaveBeenCalledWith([]);
});

it('rejects native form change requests for a read-only selection', () => {
  const change = vi.fn();
  const view = render(
    <form>
      <ShadcnSelect
        label="Choice"
        value="one"
        items={items}
        readOnly
        onValueChange={change}
      />
    </form>,
  );
  const hidden = view.container.querySelector('select');
  if (!hidden) throw new Error('Missing SDK form control.');
  fireEvent.change(hidden, { target: { value: 'two' } });
  expect(change).not.toHaveBeenCalled();
});

it('closes inactive popups without focusing their hidden owners', async () => {
  const view = render(
    <PortalActiveContext value={true}>
      <ShadcnSelect
        label="Choice"
        value="one"
        items={items}
        onValueChange={() => undefined}
      />
    </PortalActiveContext>,
  );
  const trigger = screen.getByRole('combobox', { name: 'Choice' });
  await userEvent.click(trigger);
  expect(screen.getByRole('listbox', { name: 'Choice' })).toBeVisible();
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnSelect
        label="Choice"
        value="one"
        items={items}
        onValueChange={() => undefined}
      />
    </PortalActiveContext>,
  );
  expect(screen.queryByRole('listbox')).toBeNull();
  expect(trigger).not.toHaveFocus();
});

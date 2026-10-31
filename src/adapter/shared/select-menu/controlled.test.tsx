import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { SelectMenu, ReacdProvider } from '../../../index.js';
import { selectMenuSchema } from '../../../schema/select-menu/index.js';

const base = {
  label: 'Controlled records',
  value: '',
  items: [
    { value: '42', label: 'Answer' },
    { value: 'beta', label: 'Beta' },
  ],
  onValueChange: () => undefined,
};

it('retains selection/query on an exact logical veto', async () => {
  const user = userEvent.setup();
  const change = vi.fn<(value: string) => boolean>(() => false);
  const search = vi.fn<(value: string) => boolean>(() => false);
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu {...base} onValueChange={change} query="" onQueryChange={search} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: base.label }));
  const query = await screen.findByRole('combobox', { name: `Search ${base.label}` });
  await user.type(query, 'a');
  expect(search).toHaveBeenCalledExactlyOnceWith('a');
  expect(query).toHaveValue('');
  await user.click(screen.getByRole('option', { name: 'Answer' }));
  expect(change).toHaveBeenCalledExactlyOnceWith('42');
  expect(screen.getByRole('listbox')).toBeVisible();
});

it('reports invalid callback returns without follow-ups', async () => {
  const user = userEvent.setup();
  const props = selectMenuSchema.parse({ ...base, onValueChange: () => 'invalid' });
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu {...props} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: base.label }));
  await user.click(await screen.findByRole('option', { name: 'Answer' }));
  expect(screen.getByRole('alert')).toHaveTextContent('boolean or no value');
  expect(screen.getByRole('listbox')).toBeVisible();
  expect(screen.getByRole('combobox', { name: base.label })).toHaveTextContent(
    'Choose an option.',
  );
});

it('keeps popup on veto and restores focus on host close', async () => {
  const user = userEvent.setup();
  const close = vi.fn<(value: boolean) => boolean>(() => false);
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu {...base} open onOpenChange={close} />
    </ReacdProvider>,
  );
  const query = await screen.findByRole('combobox', { name: `Search ${base.label}` });
  await user.click(query);
  await user.keyboard('{Escape}');
  expect(close).toHaveBeenCalledExactlyOnceWith(false);
  expect(query).toHaveFocus();
  view.rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu {...base} open={false} onOpenChange={close} />
    </ReacdProvider>,
  );
  await waitFor(() =>
    expect(screen.getByRole('combobox', { name: base.label })).toHaveFocus(),
  );
});

it('does not activate during IME and commits final query once', async () => {
  const user = userEvent.setup();
  const change = vi.fn();
  const search = vi.fn();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu {...base} onValueChange={change} query="" onQueryChange={search} />
    </ReacdProvider>,
  );
  await user.click(screen.getByRole('combobox', { name: base.label }));
  const query = await screen.findByRole('combobox', { name: `Search ${base.label}` });
  await user.keyboard('{ArrowDown}');
  fireEvent.compositionStart(query);
  fireEvent.change(query, { target: { value: '東' } });
  fireEvent.keyDown(query, { key: 'Enter', keyCode: 13, isComposing: true });
  fireEvent.keyDown(query, { key: 'Enter', keyCode: 229 });
  expect(change).not.toHaveBeenCalled();
  expect(search).not.toHaveBeenCalled();
  fireEvent.compositionEnd(query, { target: { value: '東京' } });
  expect(search).toHaveBeenCalledExactlyOnceWith('東京');
});

it('does not open or search from a composing trigger prefix', () => {
  const search = vi.fn();
  const open = vi.fn();
  render(
    <ReacdProvider adapter={activeTestAdapter}>
      <SelectMenu
        {...base}
        query=""
        onQueryChange={search}
        open={false}
        onOpenChange={open}
      />
    </ReacdProvider>,
  );
  const trigger = screen.getByRole('combobox', { name: base.label });
  fireEvent.keyDown(trigger, { key: '東', isComposing: true, keyCode: 13 });
  fireEvent.keyDown(trigger, { key: 'a', keyCode: 229 });
  expect(search).not.toHaveBeenCalled();
  expect(open).not.toHaveBeenCalled();
});

import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { selectMenuSchema } from '../../../schema/select-menu/index.js';
import { CONTENT_POLICY } from '../../../core/policy.js';
import { FieldMetadataContext } from '../../../renderer/form-field/field-metadata.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { ShadcnSelectMenu } from './select-menu.adapter.js';

const items = [
  { value: 'a', label: 'Alpha', description: 'First team' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma', disabled: true },
];

it('toggles native multiple choices and removes old disabled values', async () => {
  const change = vi.fn();
  function Example() {
    const [value, setValue] = useState<readonly string[]>(['c']);
    return (
      <ShadcnSelectMenu
        label="Owner"
        mode="multiple"
        value={value}
        onValueChange={(next) => {
          change(next);
          setValue(next);
        }}
        items={items}
      />
    );
  }
  render(<Example />);
  const trigger = screen.getByRole('combobox', { name: 'Owner' });
  await userEvent.click(trigger);
  await userEvent.click(await screen.findByRole('option', { name: 'Gamma' }));
  expect(change).toHaveBeenCalledWith([]);
  await userEvent.click(screen.getByRole('option', { name: /Alpha/u }));
  expect(change).toHaveBeenLastCalledWith(['a']);
  await userEvent.keyboard('{Escape}');
  await userEvent.click(screen.getByRole('button', { name: 'Clear selection Owner' }));
  expect(change).toHaveBeenLastCalledWith([]);
  expect(trigger).toHaveFocus();
});

it('keeps readonly selection searchable and protects query', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnSelectMenu
      label="Owner"
      value="b"
      readOnly
      onValueChange={change}
      items={items}
      description="Choose your team"
    />,
  );
  screen.getByRole('combobox', { name: 'Owner' }).focus();
  await userEvent.keyboard('a');
  expect(change).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('combobox', { name: 'Owner' }));
  const input = await screen.findByRole('combobox', { name: 'Search Owner' });
  await userEvent.type(input, 'Alpha');
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(change).not.toHaveBeenCalled();
  expect(input).toHaveValue('Alpha');
  view.rerender(
    <ShadcnSelectMenu
      label="Owner"
      value="b"
      query="fixed"
      onQueryChange={change}
      queryReadOnly
      onValueChange={change}
      items={items}
    />,
  );
  fireEvent.change(input, { target: { value: 'attempt' } });
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ShadcnSelectMenu label="Owner" value="b" onValueChange={change} items={items} />,
  );
  fireEvent.change(input, {
    target: {
      value: 'x'.repeat(CONTENT_POLICY.maxTextLength + 1),
    },
  });
  expect(input).not.toHaveValue('x'.repeat(CONTENT_POLICY.maxTextLength + 1));
});

it('honors external order and native loading and errors', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnSelectMenu
      label="Owner"
      value=""
      open
      onOpenChange={change}
      onValueChange={change}
      items={items}
      visibleValues={['b', 'a']}
      emptyMessage="Nothing found"
    />,
  );
  await screen.findByRole('option', { name: 'Beta' });
  expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
    'Beta',
    'AlphaFirst team',
  ]);
  view.rerender(
    <ShadcnSelectMenu
      label="Owner"
      value=""
      open
      onOpenChange={change}
      onValueChange={change}
      items={items}
      status="loading"
      loadingMessage="Fetching teams"
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Fetching teams');
  expect(screen.queryByRole('option')).toBeNull();
  view.rerender(
    <ShadcnSelectMenu
      label="Owner"
      value=""
      open
      onOpenChange={change}
      onValueChange={change}
      items={items}
      status="error"
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Options could not be loaded.');
  view.rerender(
    <ShadcnSelectMenu
      label="Owner"
      value=""
      open
      onOpenChange={change}
      onValueChange={change}
      items={[]}
      status="loading"
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Loading options.');
  view.rerender(
    <ShadcnSelectMenu
      label="Owner"
      value=""
      open
      onOpenChange={change}
      onValueChange={change}
      items={[]}
      status="error"
      errorMessage="Teams unavailable"
    />,
  );
  expect(screen.getByRole('alert')).toHaveTextContent('Teams unavailable');
});

it('restores focus for accepted clear and preserves vetoed clear', async () => {
  const change = vi.fn(() => false);
  render(
    <ShadcnSelectMenu label="Owner" value="a" onValueChange={change} items={items} />,
  );
  const clear = screen.getByRole('button', { name: 'Clear selection Owner' });
  await userEvent.click(clear);
  expect(clear).toHaveFocus();
  expect(screen.getByRole('combobox', { name: 'Owner' })).toHaveTextContent('Alpha');
});

it('reports callback failures without accepting selection', async () => {
  const props = selectMenuSchema.parse({
    label: 'Owner',
    value: 'a',
    items,
    onValueChange: () => Promise.resolve(true),
  });
  const view = render(<ShadcnSelectMenu {...props} />);
  await userEvent.click(screen.getByRole('combobox', { name: 'Owner' }));
  await userEvent.click(await screen.findByRole('option', { name: 'Beta' }));
  expect(screen.getByRole('alert')).toHaveTextContent('boolean or no value');
  expect(screen.getByRole('combobox', { name: 'Owner' })).toHaveTextContent('Alpha');
  view.rerender(
    <ShadcnSelectMenu
      label="Owner"
      value="a"
      items={items}
      onValueChange={() => {
        throw new Error('Failed');
      }}
    />,
  );
  await userEvent.click(screen.getByRole('option', { name: 'Beta' }));
  expect(screen.getByRole('alert')).toHaveTextContent('could not be completed');
});

it('vetoes native disclosure requests', async () => {
  const open = vi.fn(() => false);
  render(
    <ShadcnSelectMenu
      label="Owner"
      value="a"
      items={items}
      onValueChange={vi.fn()}
      open={false}
      onOpenChange={open}
    />,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Owner' }));
  expect(screen.queryByRole('listbox')).toBeNull();
  screen.getByRole('combobox', { name: 'Owner' }).focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(open).toHaveBeenCalledWith(true);
});

it('vetoes controlled query requests', async () => {
  const query = vi.fn(() => false);
  render(
    <ShadcnSelectMenu
      label="Owner"
      value="a"
      items={items}
      onValueChange={vi.fn()}
      query=""
      onQueryChange={query}
    />,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Owner' }));
  const input = await screen.findByRole('combobox', { name: 'Search Owner' });
  await userEvent.type(input, 'X');
  expect(query).toHaveBeenCalledWith('X');
  expect(input).toHaveValue('');
});

it('closes inactive SDK portals and inherits disabled field safety', async () => {
  const change = vi.fn();
  const view = render(
    <PortalActiveContext value={true}>
      <ShadcnSelectMenu label="Owner" value="a" onValueChange={change} items={items} />
    </PortalActiveContext>,
  );
  await userEvent.click(screen.getByRole('combobox', { name: 'Owner' }));
  await screen.findByRole('listbox');
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnSelectMenu label="Owner" value="a" onValueChange={change} items={items} />
    </PortalActiveContext>,
  );
  await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
  fireEvent.keyDown(screen.getByRole('combobox', { name: 'Owner' }), {
    key: 'ArrowDown',
  });
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <FieldMetadataContext
      value={{
        name: 'owner',
        required: true,
        disabled: true,
        error: 'Locked',
        descriptionIds: [],
      }}
    >
      <ShadcnSelectMenu
        label="Owner"
        value="a"
        onValueChange={change}
        items={items}
        disabled={false}
        clearable={false}
      />
    </FieldMetadataContext>,
  );
  expect(screen.getByRole('combobox', { name: 'Owner' })).toBeDisabled();
  expect(screen.getByRole('combobox', { name: 'Owner' })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  expect(change).not.toHaveBeenCalled();
  fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
});

import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { expect, it, vi } from 'vitest';
import { FormPendingContext } from '../../../renderer/form/interaction-context.js';
import { MuiCommandPalette } from './command-palette.adapter.js';
import { commandSelectSchema } from
  '../../../schema/command-palette/command-palette.schema.js';

it(
  'uses native inline MUI autocomplete for controlled query and keyboard actions',
  async () => {
    const press = vi.fn();
    const select = vi.fn();
    function View() {
      const [query, setQuery] = useState('');
      return (
        <MuiCommandPalette
          label="Find commands"
          query={query}
          onQueryChange={setQuery}
          onSelect={select}
          groups={[
            {
              key: 'work',
              label: 'Workspace',
              items: [
                {
                  key: 'cafe',
                  label: 'Café',
                  keywords: ['drink'],
                  description: 'Coffee break',
                  onPress: press,
                },
                { key: 'locked', label: 'Unavailable', disabled: true },
              ],
            },
          ]}
        />
      );
    }
    render(<View />);
    expect(screen.getByRole('option', { name: /Unavailable/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    const input = screen.getByRole('combobox', { name: 'Find commands' });
    expect(input.closest('.MuiTextField-root')).not.toBeNull();
    expect(screen.getByRole('listbox').classList.contains('MuiList-root')).toBe(true);
    const user = userEvent.setup();
    await user.type(input, 'cafe drink');
    expect(screen.queryByRole('option', { name: /Unavailable/ })).toBeNull();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(select).toHaveBeenCalledExactlyOnceWith('cafe');
    expect(press).toHaveBeenCalledExactlyOnceWith();
    expect(input).toHaveValue('cafe drink');
  },
);

it('blocks pending commands and query edits without losing controlled text', () => {
  const change = vi.fn();
  const press = vi.fn();
  render(
    <FormPendingContext value={true}>
      <MuiCommandPalette
        label="Find"
        query="draft"
        onQueryChange={change}
        groups={[
          {
            key: 'work',
            label: 'Work',
            items: [{ key: 'draft', label: 'Draft', onPress: press }],
          },
        ]}
      />
    </FormPendingContext>,
  );
  const input = screen.getByRole('combobox', { name: 'Find' });
  expect(input).toBeDisabled();
  expect(input).toHaveValue('draft');
  fireEvent.change(input, { target: { value: 'ignored' } });
  fireEvent.click(screen.getByRole('option', { name: 'Draft' }));
  expect(change).not.toHaveBeenCalled();
  expect(press).not.toHaveBeenCalled();
});

it(
  'preserves external order, all status copy and editable query recovery',
  async () => {
    const query = vi.fn();
    const props = {
      label: 'Find',
      query: 'unmatched',
      onQueryChange: query,
      groups: [
        {
          key: 'work',
          label: 'Work',
          items: [
            { key: 'z', label: 'Last', onPress: vi.fn() },
            { key: 'a', label: 'First', onPress: vi.fn() },
          ],
        },
      ],
    };
    const view = render(<MuiCommandPalette {...props} filtering="external" />);
    expect(screen.getAllByRole('option').map((item) => item.textContent)).toEqual([
      'Last',
      'First',
    ]);
    for (const status of ['ready', 'loading', 'error'] as const) {
      view.rerender(<MuiCommandPalette {...props} groups={[]} status={status} />);
      expect(screen.getByRole(status === 'error' ? 'alert' : 'status'))
        .toHaveTextContent(
        status === 'ready'
          ? 'No matching commands.'
          : status === 'loading'
            ? 'Loading commands.'
            : 'Commands could not be loaded.',
      );
      view.rerender(
        <MuiCommandPalette
          {...props}
          groups={[]}
          status={status}
          emptyMessage="No results"
          loadingMessage="Fetching"
          errorMessage="Try again"
        />,
      );
      expect(screen.getByRole(status === 'error' ? 'alert' : 'status'))
        .toHaveTextContent(
        status === 'ready'
          ? 'No results'
          : status === 'loading'
            ? 'Fetching'
            : 'Try again',
      );
      fireEvent.change(screen.getByRole('combobox'), { target: { value: status } });
      expect(query).toHaveBeenLastCalledWith(status);
    }
  },
);

it(
  'vetoes native activation, shows invalid output and protects IME Enter',
  async () => {
    const press = vi.fn();
    const select = vi.fn(() => false);
    const props = {
      label: 'Find',
      query: '',
      onQueryChange: vi.fn(),
      onSelect: select,
      groups: [
        {
          key: 'work',
          label: 'Work',
          items: [{ key: 'draft', label: 'Draft', onPress: press }],
        },
      ],
    };
    const view = render(<MuiCommandPalette {...props} />);
    const user = userEvent.setup();
    const input = screen.getByRole('combobox');
    input.focus();
    await user.keyboard('{ArrowDown}');
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13, isComposing: true });
    expect(select).not.toHaveBeenCalled();
    await user.keyboard('{Enter}');
    expect(select).toHaveBeenCalledExactlyOnceWith('draft');
    expect(press).not.toHaveBeenCalled();
    view.rerender(
      <MuiCommandPalette
        {...props}
        onSelect={commandSelectSchema.parse(() => 'invalid')}
      />,
    );
    await user.click(screen.getByRole('option', { name: 'Draft' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Selection callbacks');
    fireEvent.change(input, { target: { value: 'd' } });
    expect(screen.queryByRole('alert')).toBeNull();
    expect(props.onQueryChange).toHaveBeenCalledWith('d');
  },
);

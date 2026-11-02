import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnContentSearch } from './content-search.adapter.js';
import { commandSelectSchema } from
  '@fastsprout/reacd/adapter-runtime/schema/command-palette/command-palette.schema.js';
import { ContentSearch, ContentSearchButton, ReacdProvider } from '../../../index.js';

it('uses native SDK search, selection and focus restoration', async () => {
  const select = vi.fn();
  function View() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    return (
      <ShadcnContentSearch
        title="Search documentation"
        label="Find a page"
        triggerLabel="Search documentation"
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        groups={[
          {
            key: 'components',
            label: 'Components',
            items: [{ key: 'button', label: 'Button', onPress: select }],
          },
        ]}
      />
    );
  }
  const user = userEvent.setup();
  render(<View />);
  const trigger = screen.getByRole('button', { name: 'Search documentation' });
  await user.click(trigger);
  const input = screen.getByRole('combobox', { name: 'Find a page' });
  expect(input).toHaveFocus();
  await user.type(input, 'Button');
  await user.keyboard('{ArrowDown}{Enter}');
  expect(select).toHaveBeenCalledOnce();
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(trigger).toHaveFocus();
});

it('uses a separate SDK opener and retains query through dismissal', async () => {
  function View() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    return (
      <ReacdProvider>
        <ContentSearchButton open={open} onOpenChange={setOpen} />
        <ContentSearch
          title="Find documentation"
          label="Find a page"
          open={open}
          onOpenChange={setOpen}
          query={query}
          onQueryChange={setQuery}
          groups={[]}
          emptyMessage="No pages"
          description="Search the docs"
          closeLabel="Done"
          footer="Footer"
        />
      </ReacdProvider>
    );
  }
  const user = userEvent.setup();
  render(<View />);
  expect(screen.getAllByRole('button')).toHaveLength(1);
  const opener = screen.getByRole('button', { name: 'Search documentation' });
  await user.click(opener);
  const input = screen.getByRole('combobox', { name: 'Find a page' });
  expect(input).toHaveFocus();
  await user.type(input, 'persist');
  await user.keyboard('{Escape}');
  expect(opener).toHaveFocus();
  await user.click(opener);
  expect(screen.getByRole('combobox')).toHaveValue('persist');
  await user.click(screen.getByRole('button', { name: 'Done' }));
  expect(opener).toHaveFocus();
});

it('vetoes invalid selection and can keep accepted searches open', async () => {
  const change = vi.fn();
  const press = vi.fn();
  const base = {
    title: 'Search',
    label: 'Find',
    open: true,
    onOpenChange: change,
    query: '',
    onQueryChange: vi.fn(),
    groups: [
      {
        key: 'pages',
        label: 'Pages',
        items: [{ key: 'button', label: 'Button', onPress: press }],
      },
    ],
  };
  const view = render(<ShadcnContentSearch {...base} onSelect={() => false} />);
  await userEvent.click(screen.getByRole('option'));
  expect(press).not.toHaveBeenCalled();
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <ShadcnContentSearch
      {...base}
      onSelect={commandSelectSchema.parse(async () => true)}
    />,
  );
  await userEvent.click(screen.getByRole('option'));
  expect(screen.getByRole('alert')).toBeVisible();
  expect(change).not.toHaveBeenCalled();
  view.rerender(<ShadcnContentSearch {...base} closeOnSelect={false} />);
  await userEvent.click(screen.getByRole('option'));
  expect(press).toHaveBeenCalledOnce();
  expect(change).not.toHaveBeenCalled();
  view.rerender(<ShadcnContentSearch {...base} closeOnSelect />);
  await userEvent.click(screen.getByRole('option'));
  expect(change).toHaveBeenCalledWith(false);
});

it('does not restore disconnected external openers', async () => {
  function View() {
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(true);
    return (
      <>
        {show && <button onClick={() => setOpen(true)}>External opener</button>}
        <ShadcnContentSearch
          title="Search"
          label="Find"
          open={open}
          onOpenChange={setOpen}
          query=""
          onQueryChange={vi.fn()}
          groups={[]}
          footer={<button onClick={() => setShow(false)}>Remove opener</button>}
        />
      </>
    );
  }
  render(<View />);
  const opener = screen.getByRole('button', { name: 'External opener' });
  await userEvent.click(opener);
  await userEvent.click(screen.getByRole('button', { name: 'Remove opener' }));
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('restores the input after programmatic search activation', async () => {
  const change = vi.fn();
  const search = (open: boolean) => (
    <>
      <input aria-label="Current field" />
      <ShadcnContentSearch
        title="Search documentation"
        label="Find a page"
        open={open}
        onOpenChange={change}
        query=""
        onQueryChange={vi.fn()}
        groups={[]}
      />
    </>
  );
  const view = render(search(false));
  const current = screen.getByRole('textbox', { name: 'Current field' });
  current.focus();
  view.rerender(search(true));
  expect(screen.getByRole('combobox', { name: 'Find a page' })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(change).toHaveBeenCalledExactlyOnceWith(false);
  view.rerender(search(false));
  await waitFor(() => expect(current).toHaveFocus());
});

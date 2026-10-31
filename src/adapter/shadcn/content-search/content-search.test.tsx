import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContentSearch, ContentSearchButton, ReacdProvider } from '../../../index.js';
import { contentSearchSchema } from '../../../schema/content-search/index.js';

function Example({
  accept,
  close = true,
}: {
  accept: (key: string) => boolean | void;
  close?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  return (
    <ReacdProvider adapter={shadcnAdapter}>
      <ContentSearchButton
        label="Open reference search"
        open={open}
        onOpenChange={setOpen}
      />
      <ContentSearch
        title="Reference search"
        label="Find reference"
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        onSelect={accept}
        closeOnSelect={close}
        groups={[
          {
            key: 'reference',
            label: 'References',
            items: [{ key: 'guide', label: 'Guide' }],
          },
        ]}
      />
    </ReacdProvider>
  );
}

describe('controlled content search', () => {
  it('handles absent callbacks and uses the shared close defaults', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const change = vi.fn();
    render(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentSearch
          title="Search defaults"
          label="Find defaults"
          open
          onOpenChange={change}
          query=""
          onQueryChange={() => undefined}
          groups={[
            {
              key: 'docs',
              label: 'Docs',
              items: [{ key: 'run', label: 'Run default', onPress: action }],
            },
          ]}
        />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('option', { name: 'Run default' }));
    expect(change).toHaveBeenCalledWith(false);
    expect(action).toHaveBeenCalledWith();
  });

  it('fails closed on invalid asynchronous selection and recovers', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const change = vi.fn();
    const props = contentSearchSchema.parse({
      title: 'Selection guard',
      label: 'Find guarded',
      open: true,
      onOpenChange: change,
      query: '',
      onQueryChange: vi.fn(),
      onSelect: () => Promise.resolve(true),
      groups: [
        {
          key: 'docs',
          label: 'Docs',
          items: [{ key: 'run', label: 'Guarded command', onPress: action }],
        },
      ],
    });
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentSearch {...props} />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('option', { name: 'Guarded command' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Selection callbacks');
    expect(action).not.toHaveBeenCalled();
    expect(change).not.toHaveBeenCalled();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <ContentSearch {...props} onSelect={() => true} />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('option', { name: 'Guarded command' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(action).toHaveBeenCalledOnce();
  });
  it('preserves the query through veto and accepted selection', async () => {
    const user = userEvent.setup();
    const accept = vi.fn<(key: string) => boolean | void>(() => false);
    render(<Example accept={accept} />);
    const opener = screen.getByRole('button', { name: 'Open reference search' });
    await user.click(opener);
    const input = screen.getByRole('combobox', { name: 'Find reference' });
    await user.type(input, 'guide');
    await user.click(screen.getByRole('option', { name: 'Guide' }));
    expect(screen.getByRole('dialog')).toBeVisible();
    accept.mockReturnValue(true);
    await user.click(screen.getByRole('option', { name: 'Guide' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(opener).toHaveFocus());
    await user.click(opener);
    expect(screen.getByRole('combobox')).toHaveValue('guide');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('keeps a requested persistent dialog open after selection', async () => {
    const user = userEvent.setup();
    const accept = vi.fn();
    render(<Example accept={accept} close={false} />);
    await user.click(screen.getByRole('button', { name: 'Open reference search' }));
    await user.click(screen.getByRole('option', { name: 'Guide' }));
    expect(accept).toHaveBeenCalledWith('guide');
    expect(screen.getByRole('dialog')).toBeVisible();
  });
});

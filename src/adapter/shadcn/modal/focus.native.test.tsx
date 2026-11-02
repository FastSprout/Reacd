import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnModal } from './modal.adapter.js';

it('restores the programmatic opener instead of another trigger', async () => {
  function Example() {
    const [open, change] = useState(false);
    return (
      <>
        <button onClick={() => change(true)}>Open from toolbar</button>
        <ShadcnModal
          title="Edit"
          description="Details"
          open={open}
          onOpenChange={change}
          triggerLabel="Declared trigger"
        />
      </>
    );
  }
  render(<Example />);
  const opener = screen.getByRole('button', { name: 'Open from toolbar' });
  await userEvent.click(opener);
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(opener).toHaveFocus());
});

it('honors supported open and close autofocus cancellation', async () => {
  const openFocus = vi.fn((event: Event) => event.preventDefault());
  const closeFocus = vi.fn((event: Event) => event.preventDefault());
  const view = render(<button>Opener</button>);
  const opener = screen.getByRole('button', { name: 'Opener' });
  opener.focus();
  view.rerender(
    <>
      <button>Opener</button>
      <ShadcnModal
        title="Edit"
        description="Details"
        open
        onOpenChange={() => undefined}
        onOpenAutoFocus={openFocus}
        onCloseAutoFocus={closeFocus}
      />
    </>,
  );
  expect(openFocus).toHaveBeenCalledOnce();
  expect(opener).toHaveFocus();
  screen.getByRole('button', { name: 'Close' }).focus();
  view.rerender(<><button>Opener</button></>);
  await waitFor(() => expect(closeFocus).toHaveBeenCalledOnce());
  expect(opener.isConnected).toBe(true);
  expect(opener).not.toHaveFocus();
  expect(document.body).toHaveFocus();
});

it('preserves native nonmodal focus on an outside interaction', async () => {
  function Example() {
    const [open, change] = useState(false);
    return (
      <>
        <button>Outside action</button>
        <ShadcnModal
          title="Edit"
          description="Details"
          open={open}
          modal={false}
          onOpenChange={change}
          triggerLabel="Open"
        />
      </>
    );
  }
  render(<Example />);
  await userEvent.click(screen.getByRole('button', { name: 'Open' }));
  const outside = screen.getByRole('button', { name: 'Outside action' });
  await userEvent.click(outside);
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(outside).toHaveFocus();
});

it('does not restore a disconnected programmatic opener', async () => {
  const view = render(<button>Opener</button>);
  const opener = screen.getByRole('button', { name: 'Opener' });
  opener.focus();
  view.rerender(
    <>
      <button>Opener</button>
      <ShadcnModal title="Edit" description="Details" open
        onOpenChange={() => undefined} />
    </>,
  );
  view.unmount();
  await waitFor(() => expect(document.body).toHaveFocus());
  expect(opener.isConnected).toBe(false);
});

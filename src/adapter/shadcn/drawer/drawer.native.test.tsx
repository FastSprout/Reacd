import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnDrawer } from './drawer.adapter.js';
import { Input } from '../vendor/ui/input.js';

function Example() {
  const [open, change] = useState(false);
  return (
    <ShadcnDrawer
      title="Drawer"
      description="Drawer details"
      open={open}
      onOpenChange={change}
      triggerLabel="Open drawer"
      retainContent
    >
      <Input aria-label="Drawer draft" defaultValue="Initial" />
    </ShadcnDrawer>
  );
}
it('preserves retained input across native Drawer closes', async () => {
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Open drawer' });
  await userEvent.click(trigger);
  expect(screen.getByRole('dialog', { name: 'Drawer' })).toHaveAttribute(
    'data-slot',
    'drawer-popup',
  );
  expect(document.querySelector('[data-slot="drawer-swipe-handle"]')).not.toBeNull();
  await userEvent.type(screen.getByRole('textbox', { name: 'Drawer draft' }), ' saved');
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  await userEvent.click(trigger);
  expect(screen.getByRole('textbox', { name: 'Drawer draft' })).toHaveValue(
    'Initial saved',
  );
});
it('maps fullscreen, handle-free and nondismissible panel variants', async () => {
  const change = vi.fn();
  render(
    <ShadcnDrawer
      title="Drawer"
      description="Drawer details"
      open
      onOpenChange={change}
      placement="top"
      handle={false}
      dismissible={false}
      fullscreen
      overlay={false}
      modal={false}
      footer="Footer"
    />,
  );
  const dialog = screen.getByRole('dialog', { name: 'Drawer' });
  expect(dialog).toHaveAttribute('data-swipe-direction', 'up');
  expect(dialog.className).toContain('w-dvw');
  expect(document.querySelector('[data-slot="drawer-swipe-handle"]')).toBeNull();
  expect(document.querySelector('[data-slot="drawer-overlay"]')).toBeNull();
  await userEvent.keyboard('{Escape}');
  expect(change).not.toHaveBeenCalled();
  expect(screen.getByText('Footer')).toBeVisible();
});

it.each(['start', 'end'] as const)(
  'maps horizontal %s placement and vetoes outside dismissal',
  async (placement) => {
    const change = vi.fn();
    render(
      <>
        <button type="button">Outside</button>
        <ShadcnDrawer
          title="Drawer"
          description="Details"
          open
          onOpenChange={change}
          placement={placement}
          modal={false}
          dismissible={false}
        >
          Content
        </ShadcnDrawer>
      </>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
    expect(change).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(change).toHaveBeenCalledWith(false);
  },
);

it('uses the SDK nested drawer root and dismisses the inner panel first', async () => {
  function Nested() {
    const [open, change] = useState(false);
    return (
      <ShadcnDrawer
        title="Outer"
        description="Outer details"
        open
        onOpenChange={() => undefined}
      >
        <ShadcnDrawer
          title="Inner"
          description="Inner details"
          open={open}
          onOpenChange={change}
          triggerLabel="Open inner"
        >
          Inner content
        </ShadcnDrawer>
      </ShadcnDrawer>
    );
  }
  render(<Nested />);
  await userEvent.click(screen.getByRole('button', { name: 'Open inner' }));
  expect(screen.getByRole('dialog', { name: 'Inner' })).toBeVisible();
  await userEvent.keyboard('{Escape}');
  await waitFor(() =>
    expect(screen.queryByRole('dialog', { name: 'Inner' })).toBeNull(),
  );
  expect(screen.getByRole('dialog', { name: 'Outer' })).toBeVisible();
});

it('locks native document scrolling only for a modal drawer', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnDrawer
      title="Modal drawer"
      description="Details"
      open
      onOpenChange={change}
    />,
  );
  await screen.findByRole('dialog', { name: 'Modal drawer' });
  expect(document.body.style.overflowY).toBe('hidden');
  view.unmount();
  render(
    <ShadcnDrawer
      title="Nonmodal drawer"
      description="Details"
      open
      onOpenChange={change}
      modal={false}
    />,
  );
  await screen.findByRole('dialog', { name: 'Nonmodal drawer' });
  expect(document.body.style.overflowY).not.toBe('hidden');
});

it('allows native outside dismissal for nonmodal drawers', async () => {
  const change = vi.fn();
  render(
    <>
      <button type="button">Outside</button>
      <ShadcnDrawer
        title="Drawer"
        description="Details"
        open
        onOpenChange={change}
        modal={false}
      >
        Content
      </ShadcnDrawer>
    </>,
  );
  await screen.findByRole('dialog', { name: 'Drawer' });
  await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
  expect(change).toHaveBeenCalledWith(false);
});

it('keeps native modal keyboard traversal inside the drawer', async () => {
  const change = vi.fn();
  render(
    <>
      <button type="button">Outside</button>
      <ShadcnDrawer
        title="Keyboard drawer"
        description="Details"
        open
        onOpenChange={change}
      >
        <Input aria-label="Drawer input" />
      </ShadcnDrawer>
    </>,
  );
  const dialog = await screen.findByRole('dialog', { name: 'Keyboard drawer' });
  await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  for (let index = 0; index < 5; index += 1) {
    await userEvent.tab();
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  }
  expect(change).not.toHaveBeenCalled();
});

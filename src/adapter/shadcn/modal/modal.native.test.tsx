import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { ShadcnModal } from './modal.adapter.js';

it('delegates portals, Escape and focus restoration to the SDK', async () => {
  function Example() {
    const [open, setOpen] = useState(false);
    return (
      <ShadcnModal
        title="Edit project"
        description="Project details"
        open={open}
        onOpenChange={setOpen}
        triggerLabel="Edit"
        footer="Footer"
      >
        Content
      </ShadcnModal>
    );
  }
  render(<Example />);
  await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
  const dialog = screen.getByRole('dialog', { name: 'Edit project' });
  expect(dialog).toHaveAttribute('data-slot', 'dialog-content');
  expect(dialog.className).toContain('motion-reduce:animate-none');
  expect(document.querySelector('[data-slot=dialog-overlay]')?.className).toContain(
    'motion-reduce:animate-none',
  );
  expect(dialog).toHaveAccessibleDescription('Project details');
  expect(screen.getByText('Footer')).toBeVisible();
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus();
});

it('maps nondismissible, overlay-free, fullscreen and retained variants', async () => {
  const change = vi.fn();
  const view = render(
    <ShadcnModal
      title="Edit"
      description="Details"
      open
      onOpenChange={change}
      dismissible={false}
      overlay={false}
      fullscreen
      retainContent
      closeLabel="Done"
    >
      Content
    </ShadcnModal>,
  );
  expect(document.querySelector('[data-slot="dialog-overlay"]')).toBeNull();
  const dialog = screen.getByRole('dialog', { name: 'Edit' });
  expect(dialog.className).toContain('h-dvh');
  await userEvent.keyboard('{Escape}');
  expect(change).not.toHaveBeenCalled();
  fireEvent.pointerDown(document.body, { pointerType: 'mouse', button: 0 });
  expect(change).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Done' }));
  expect(change).toHaveBeenCalledWith(false);
  view.rerender(
    <ShadcnModal
      title="Edit"
      description="Details"
      open={false}
      onOpenChange={change}
      retainContent
    >
      Content
    </ShadcnModal>,
  );
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('lets the SDK dismiss a nonmodal dialog through an outside pointer', async () => {
  const change = vi.fn();
  render(
    <ShadcnModal
      title="Edit"
      description="Details"
      open
      onOpenChange={change}
      modal={false}
    >
      Content
    </ShadcnModal>,
  );
  await userEvent.click(document.body);
  expect(change).toHaveBeenCalledWith(false);
});

it('lets SDK pointer dismissal remain cancelable for nonmodal content', async () => {
  const change = vi.fn();
  render(
    <ShadcnModal
      title="Edit"
      description="Details"
      open
      modal={false}
      dismissible={false}
      onOpenChange={change}
    >
      Content
    </ShadcnModal>,
  );
  await userEvent.click(document.body);
  expect(change).not.toHaveBeenCalled();
});

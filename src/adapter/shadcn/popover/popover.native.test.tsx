import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { DirectionProvider } from '@radix-ui/react-direction';
import { ShadcnPopover } from './popover.adapter.js';
import { Input } from '../vendor/ui/input.js';

function Example({ hover = false }: { hover?: boolean }) {
  const [open, change] = useState(false);
  return (
    <ShadcnPopover
      title="Details"
      description="Delivery details"
      triggerLabel="Open details"
      open={open}
      onOpenChange={change}
      mode={hover ? 'hover' : 'click'}
      openDelay="none"
      closeDelay="none"
      retainContent
      footer="Footer"
    >
      <Input aria-label="Draft" defaultValue="Initial" />
    </ShadcnPopover>
  );
}

it('delegates click, focus, Escape and retained state to native SDK', async () => {
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Open details' });
  await userEvent.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Details' });
  expect(dialog).toHaveAttribute('data-slot', 'popover-content');
  expect(dialog).toHaveAccessibleDescription('Delivery details');
  await userEvent.type(screen.getByRole('textbox', { name: 'Draft' }), ' retained');
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).toBeNull();
  await userEvent.click(trigger);
  expect(screen.getByRole('textbox', { name: 'Draft' })).toHaveValue(
    'Initial retained',
  );
  expect(screen.getByText('Footer')).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Close popover' }));
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('delegates hover entry, content and leave to the SDK', async () => {
  render(<Example hover />);
  const trigger = screen.getByRole('button', { name: 'Open details' });
  await userEvent.hover(trigger);
  const dialog = await screen.findByRole('dialog', { name: 'Details' });
  expect(dialog).toHaveAttribute('data-slot', 'hover-card-content');
  expect(dialog).toHaveAttribute('aria-modal', 'false');
  expect(screen.getByRole('textbox', { name: 'Draft' })).not.toHaveFocus();
  await userEvent.hover(dialog);
  expect(dialog).toBeVisible();
  await userEvent.unhover(dialog);
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

it('maps nondismissible, modal, disabled and logical placement variants', async () => {
  const change = vi.fn();
  const view = render(
    <DirectionProvider dir="rtl">
      <ShadcnPopover
        title="Details"
        triggerLabel="Open details"
        open
        onOpenChange={change}
        dismissible={false}
        modal
        arrow
        placement="inline-start"
        align="end"
        closeLabel="Done"
      >
        Content
      </ShadcnPopover>
    </DirectionProvider>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Details' });
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(dialog).toHaveAttribute('data-side', 'right');
  expect(dialog.querySelector('svg')).not.toBeNull();
  await userEvent.keyboard('{Escape}');
  fireEvent.pointerDown(document.body, { pointerType: 'mouse', button: 0 });
  expect(change).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Done' }));
  expect(change).toHaveBeenCalledWith(false);
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnPopover
        title="Details"
        triggerLabel="Open details"
        open
        onOpenChange={change}
        disabled
      >
        Content
      </ShadcnPopover>
    </PortalActiveContext>,
  );
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('button', { name: 'Open details' })).toBeDisabled();
});

it('uses SDK default hover delays and explicit close action', async () => {
  function Delayed() {
    const [open, change] = useState(false);
    return (
      <ShadcnPopover
        title="Preview"
        triggerLabel="Hover preview"
        open={open}
        mode="hover"
        onOpenChange={change}
      >
        Preview content
      </ShadcnPopover>
    );
  }
  render(<Delayed />);
  await userEvent.hover(screen.getByRole('button', { name: 'Hover preview' }));
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(await screen.findByRole('dialog', { name: 'Preview' })).toBeVisible();
  await userEvent.click(screen.getByRole('button', { name: 'Close popover' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

it('locks hover dismissal while permitting the close action', async () => {
  const change = vi.fn();
  const view = render(
    <>
      <button type="button">Outside</button>
      <ShadcnPopover
        title="Preview"
        triggerLabel="Hover preview"
        open
        mode="hover"
        onOpenChange={change}
        description="Preview details"
        arrow
        modal
        dismissible={false}
        retainContent={false}
        closeLabel="Done"
        placement="inline-end"
        align="start"
      >
        Content
      </ShadcnPopover>
    </>,
  );
  const dialog = screen.getByRole('dialog', { name: 'Preview' });
  expect(dialog).toHaveAccessibleDescription('Preview details');
  expect(dialog).toHaveAttribute('aria-modal', 'false');
  expect(dialog.querySelector('svg')).not.toBeNull();
  await userEvent.keyboard('{Escape}');
  await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
  expect(change).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Done' }));
  expect(change).toHaveBeenCalledWith(false);
  change.mockClear();
  view.rerender(
    <>
      <button type="button">Outside</button>
      <ShadcnPopover
        title="Preview"
        triggerLabel="Hover preview"
        open
        mode="hover"
        onOpenChange={change}
      >
        Content
      </ShadcnPopover>
    </>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
  expect(change).toHaveBeenCalledWith(false);
  change.mockClear();
  await userEvent.keyboard('{Escape}');
  expect(change).toHaveBeenCalledWith(false);
});

it('prevents focus return into inactive owners and vetoes dismissal', async () => {
  const change = vi.fn();
  const view = render(
    <PortalActiveContext value={true}>
      <button type="button">Outside</button>
      <ShadcnPopover
        title="Details"
        triggerLabel="Open details"
        open
        onOpenChange={change}
        modal={false}
        dismissible={false}
      >
        Content
      </ShadcnPopover>
    </PortalActiveContext>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <PortalActiveContext value={false}>
      <ShadcnPopover
        title="Details"
        triggerLabel="Open details"
        open
        onOpenChange={change}
        retainContent
      >
        Content
      </ShadcnPopover>
    </PortalActiveContext>,
  );
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(screen.getByRole('button', { name: 'Open details' })).not.toHaveFocus();
});

it('allows native outside dismissal for nonmodal click content', async () => {
  const change = vi.fn();
  render(
    <>
      <button type="button">Outside</button>
      <ShadcnPopover
        title="Details"
        triggerLabel="Open details"
        open
        onOpenChange={change}
        modal={false}
      >
        Content
      </ShadcnPopover>
    </>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
  expect(change).toHaveBeenCalledWith(false);
});

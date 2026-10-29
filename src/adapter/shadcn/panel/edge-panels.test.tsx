import { useState } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  App,
  Button,
  Drawer,
  Input,
  Popover,
  Modal,
  ReacdProvider,
  Slideover,
  Text,
} from '../../../index.js';
import type { SlideoverProps } from '../../../components/slideover/index.js';

const PANELS = { Drawer, Slideover };
function PanelExample({
  kind,
  ...properties
}: { kind: keyof typeof PANELS } & Partial<SlideoverProps>) {
  const Component = PANELS[kind];
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [popover, setPopover] = useState(false);
  return (
    <Component
      title={`${kind} example`}
      description="Edit the current resource."
      open={open}
      onOpenChange={setOpen}
      triggerLabel={`Open ${kind}`}
      {...properties}
      footer={
        <Button label="Footer action" onPress={() => setNote('Footer selected')} />
      }
    >
      <Input label="Panel note" value={note} onValueChange={setNote} />
      <Popover
        title="Nested details"
        triggerLabel="Open nested details"
        open={popover}
        onOpenChange={setPopover}
      >
        <Text>Nested content</Text>
      </Popover>
    </Component>
  );
}

describe.each(['Drawer', 'Slideover'] as const)('shadcn %s', (kind) => {
  it('keeps retained nested panels inactive when an ancestor is closed', () => {
    const Component = PANELS[kind];
    render(
      <ReacdProvider>
        <Modal
          title="Closed ancestor"
          description="Retained outer."
          open={false}
          onOpenChange={vi.fn()}
          retainContent
        >
          <Component
            title="Inactive descendant"
            description="Must not escape its parent."
            open
            onOpenChange={vi.fn()}
            retainContent
          />
        </Modal>
      </ReacdProvider>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('opens, scopes nested Escape, activates slots and returns focus', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <PanelExample kind={kind} />
      </ReacdProvider>,
    );
    const trigger = screen.getByRole('button', { name: `Open ${kind}` });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: `${kind} example` });
    expect(dialog).toHaveAccessibleDescription('Edit the current resource.');
    await user.type(screen.getByLabelText('Panel note'), 'Retained note');
    await user.click(screen.getByRole('button', { name: 'Footer action' }));
    expect(screen.getByLabelText('Panel note')).toHaveValue('Footer selected');
    await user.click(screen.getByRole('button', { name: 'Open nested details' }));
    await screen.findByText('Nested content');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByText('Nested content')).toBeNull());
    expect(dialog).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('keeps locked panels open until an explicit close', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <PanelExample kind={kind} dismissible={false} />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: `Open ${kind}` }));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('supports RTL edges, nonmodal/fullscreen and retained content', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const Component = PANELS[kind];
    const view = render(
      <ReacdProvider>
        <App direction="rtl">
          <Component
            title="RTL resource"
            description="A logical start panel."
            placement="start"
            open
            onOpenChange={change}
            modal={false}
            overlay={false}
            fullscreen
            retainContent
          >
            <Text>Retained content</Text>
          </Component>
        </App>
      </ReacdProvider>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('data-edge', 'right');
    expect(dialog).toHaveAttribute('aria-modal', 'false');
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(change).toHaveBeenCalledWith(false);
    expect(dialog).toBeInTheDocument();
    view.rerender(
      <ReacdProvider>
        <App direction="rtl">
          <Component
            title="RTL resource"
            description="A logical start panel."
            open={false}
            onOpenChange={change}
            retainContent
          />
        </App>
      </ReacdProvider>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does not allow a disabled trigger to request opening', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <PanelExample kind={kind} disabled overlay={false} />
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: `Open ${kind}` }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

it('can hide the decorative drawer handle without affecting dismissal', async () => {
  const user = userEvent.setup();
  const view = render(
    <ReacdProvider>
      <Drawer
        title="No handle"
        description="Drawer body"
        open
        onOpenChange={vi.fn()}
        handle={false}
      />
    </ReacdProvider>,
  );
  expect(view.container.ownerDocument.querySelector('.reacd-drawer-handle')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Close' }));
});

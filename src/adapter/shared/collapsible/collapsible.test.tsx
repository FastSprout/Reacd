import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import { render, screen, waitFor } from '../../../../test-support/adapter-testing.js';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Collapsible,
  Input,
  Modal,
  ReacdProvider,
  Select,
  Text,
} from '../../../index.js';

function LocalField() {
  const [note, setNote] = useState('');
  return <Input label="Local detail" value={note} onValueChange={setNote} />;
}
function Scene({ retainContent = false }: { retainContent?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <ReacdProvider adapter={activeTestAdapter}>
      <Collapsible
        label="Details"
        open={open}
        onOpenChange={setOpen}
        retainContent={retainContent}
      >
        <LocalField />
      </Collapsible>
    </ReacdProvider>
  );
}
describe('shadcn Collapsible', () => {
  it('uses keyboard semantics and unmounts closed child state by default', async () => {
    const user = userEvent.setup();
    render(<Scene />);
    const trigger = screen.getByRole('button', { name: 'Details' });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByLabelText('Local detail')).toBeNull();
    trigger.focus();
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region', { name: 'Details' })).toHaveAttribute(
      'id',
      trigger.getAttribute('aria-controls'),
    );
    await user.type(screen.getByLabelText('Local detail'), 'Draft');
    trigger.focus();
    await user.keyboard(' ');
    await waitFor(() => expect(screen.queryByLabelText('Local detail')).toBeNull());
    await user.click(trigger);
    expect(screen.getByLabelText('Local detail')).toHaveValue('');
  });
  it('retains child state and skips closed content during Tab', async () => {
    const user = userEvent.setup();
    render(<Scene retainContent />);
    const trigger = screen.getByRole('button', { name: 'Details' });
    await user.click(trigger);
    await user.type(screen.getByLabelText('Local detail'), 'Retained');
    await user.click(trigger);
    expect(screen.getByLabelText('Local detail')).not.toBeVisible();
    await user.tab();
    expect(screen.getByLabelText('Local detail')).not.toHaveFocus();
    await user.click(trigger);
    expect(screen.getByLabelText('Local detail')).toHaveValue('Retained');
  });
  it('allows rejected requests and programmatic/external opening', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const view = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <Collapsible label="Controlled" open={false} onOpenChange={change}>
          <Text>Controlled body</Text>
        </Collapsible>
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Controlled' }));
    expect(change).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.queryByText('Controlled body')).toBeNull();
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <Collapsible label="Controlled" open onOpenChange={change} disabled>
          <Text>Controlled body</Text>
        </Collapsible>
      </ReacdProvider>,
    );
    expect(screen.getByRole('button', { name: 'Controlled' })).toBeDisabled();
    expect(screen.getByRole('region', { name: 'Controlled' })).toBeVisible();
    view.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <Collapsible label="Controlled" open onOpenChange={change} showTrigger={false}>
          <Text>External body</Text>
        </Collapsible>
      </ReacdProvider>,
    );
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('region', { name: 'Controlled' })).toBeVisible();
  });
  it('deactivates child portals and retains controlled values', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    function Host({ open }: { open: boolean }) {
      return (
        <ReacdProvider adapter={activeTestAdapter}>
          <Collapsible label="Host" open={open} onOpenChange={change} retainContent>
            <Select
              label="Role"
              value="a"
              onValueChange={change}
              items={[{ value: 'a', label: 'Reader' }]}
            />
            <Modal
              title="Nested"
              description="Nested dialog"
              open
              onOpenChange={change}
              triggerLabel="Open nested"
            />
          </Collapsible>
        </ReacdProvider>
      );
    }
    const view = render(<Host open />);
    expect(screen.getByRole('dialog', { name: 'Nested' })).toBeVisible();
    view.rerender(<Host open={false} />);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(screen.queryByRole('button', { name: 'Open nested' })).toBeNull();
    view.unmount();
    const menu = render(
      <ReacdProvider adapter={activeTestAdapter}>
        <Collapsible label="Menu host" open onOpenChange={change} retainContent>
          <Select
            label="Role"
            value="a"
            onValueChange={change}
            items={[{ value: 'a', label: 'Reader' }]}
          />
        </Collapsible>
      </ReacdProvider>,
    );
    await user.click(screen.getByRole('combobox', { name: 'Role' }));
    expect(screen.getByRole('listbox')).toBeVisible();
    menu.rerender(
      <ReacdProvider adapter={activeTestAdapter}>
        <Collapsible label="Menu host" open={false} onOpenChange={change} retainContent>
          <Select
            label="Role"
            value="a"
            onValueChange={change}
            items={[{ value: 'a', label: 'Reader' }]}
          />
        </Collapsible>
      </ReacdProvider>,
    );
    await waitFor(() =>
      expect(screen.queryByRole('listbox', { hidden: true })).toBeNull(),
    );
    expect(change).not.toHaveBeenCalled();
  });
});

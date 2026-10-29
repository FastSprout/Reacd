import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { chooseOption } from '../../../../test-support/select-choice.js';
import {
  Button,
  Modal,
  ReacdProvider,
  Input,
  Select,
  Text,
  VStack,
} from '../../../index.js';
import type { ModalProps } from '../../../index.js';

function Body() {
  const [value, setValue] = useState('');
  const [role, setRole] = useState('a');
  return (
    <VStack>
      <Input label="Local note" value={value} onValueChange={setValue} />
      <Select
        label="Local role"
        value={role}
        onValueChange={setRole}
        items={[
          { value: 'a', label: 'First' },
          { value: 'b', label: 'Second' },
        ]}
      />
    </VStack>
  );
}
function Example(properties: Partial<ModalProps>) {
  const [open, setOpen] = useState(false);
  return (
    <ReacdProvider>
      <Modal
        title="Edit example"
        description="Local preview"
        triggerLabel="Open example"
        open={open}
        onOpenChange={setOpen}
        {...properties}
      >
        <Body />
      </Modal>
    </ReacdProvider>
  );
}
describe('shadcn Modal', () => {
  it('suppresses nested dialogs while their retained ancestor is closed', async () => {
    const action = vi.fn();
    function Scene({ open }: { open: boolean }) {
      return (
        <ReacdProvider>
          <Button label="Background ready" onPress={action} />
          <Modal
            title="Parent"
            description="Parent dialog"
            open={open}
            onOpenChange={action}
            retainContent
          >
            <Modal title="Child" description="Child dialog" open onOpenChange={action}>
              <Text>Child content</Text>
            </Modal>
          </Modal>
        </ReacdProvider>
      );
    }
    const view = render(<Scene open={false} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    view.rerender(<Scene open />);
    expect(screen.getByRole('dialog', { name: 'Child' })).toBeInTheDocument();
    view.rerender(<Scene open={false} />);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Background ready' }));
    expect(action).toHaveBeenCalledOnce();
  });
  it('closes transient child portals when a retained host is closed', async () => {
    const user = userEvent.setup();
    const view = render(<Example open retainContent />);
    await chooseOption(user, 'Local role', 'Second');
    await user.click(screen.getByRole('combobox', { name: 'Local role' }));
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    view.rerender(<Example open={false} retainContent />);
    await waitFor(() =>
      expect(screen.queryByRole('listbox', { hidden: true })).toBeNull(),
    );
    view.rerender(<Example open retainContent />);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(screen.getByRole('combobox', { name: 'Local role' })).toHaveTextContent(
      'Second',
    );
  });
  it('labels content, dismisses with Escape, and restores trigger focus', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Open example' }));
    expect(screen.getByRole('dialog', { name: 'Edit example' })).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-describedby');
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    await user.type(screen.getByLabelText('Local note'), 'Draft');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Open example' })).toHaveFocus(),
    );
  });
  it('retains local child state without blocking the closed background', async () => {
    const user = userEvent.setup();
    render(<Example retainContent dismissible={false} footer={<Text>Footer</Text>} />);
    await user.click(screen.getByRole('button', { name: 'Open example' }));
    await user.type(screen.getByLabelText('Local note'), 'Retained');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByLabelText('Local note')).not.toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Open example' }));
    expect(screen.getByLabelText('Local note')).toHaveValue('Retained');
  });
  it('supports programmatic, non-modal, fullscreen, and disabled-trigger modes', () => {
    const { rerender } = render(
      <Example
        open
        modal={false}
        overlay={false}
        fullscreen
        triggerLabel={undefined}
      />,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('data-fullscreen', 'true');
    expect(screen.queryByRole('button', { name: 'Open example' })).toBeNull();
    rerender(<Example disabled />);
    expect(screen.getByRole('button', { name: 'Open example' })).toBeDisabled();
  });
});

import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { atom, useAtom } from 'jotai';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import {
  Button,
  Input,
  Modal,
  Popover,
  ReacdProvider,
  Text,
  Tooltip,
  createReacdStore,
} from '../../../index.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import type { PopoverProps } from '../../../components/popover/popover.js';

function Example(props: Partial<Omit<PopoverProps, 'open' | 'onOpenChange'>>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  return (
    <ReacdProvider adapter={shadcnAdapter}>
      <Popover
        title="Editor"
        triggerLabel="Open editor"
        open={open}
        onOpenChange={setOpen}
        {...props}
      >
        <Input label="Draft" value={value} onValueChange={setValue} />
      </Popover>
      <Button label="Outside action" onPress={() => undefined} />
    </ReacdProvider>
  );
}
describe('shadcn Popover', () => {
  it('edits content, dismisses, and restores trigger focus', async () => {
    const user = userEvent.setup();
    render(<Example description="Local draft" arrow footer={<Text>Footer</Text>} />);
    const trigger = screen.getByRole('button', { name: 'Open editor' });
    await user.click(trigger);
    const popup = await screen.findByRole('dialog', { name: 'Editor' });
    expect(within(popup).getByText('Local draft')).toBeInTheDocument();
    expect(within(popup).getByText('Footer')).toBeInTheDocument();
    await user.type(screen.getByLabelText('Draft'), 'Retained draft');
    await user.keyboard('{ArrowRight}{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
    await user.keyboard('{Escape}');
    await user.click(trigger);
    expect(await screen.findByLabelText('Draft')).toHaveValue('Retained draft');
    await user.click(screen.getByRole('button', { name: 'Close popover' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
  it('supports outside dismissal and a disabled trigger', async () => {
    const user = userEvent.setup();
    const view = render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Open editor' }));
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: 'Outside action' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    view.rerender(<Example disabled />);
    expect(screen.getByRole('button', { name: 'Open editor' })).toBeDisabled();
  });
  it('blocks implicit dismissal while keeping an explicit close action', async () => {
    const user = userEvent.setup();
    render(<Example dismissible={false} modal closeLabel="Close editor" />);
    await user.click(screen.getByRole('button', { name: 'Open editor' }));
    const popup = await screen.findByRole('dialog', { name: 'Editor' });
    expect(popup).toHaveAttribute('aria-modal', 'true');
    await user.keyboard('{Escape}');
    expect(popup).toBeInTheDocument();
    fireEvent.pointerDown(document.body);
    expect(popup).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close editor' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
  it('retains child state and masks open under hidden ancestors', async () => {
    const user = userEvent.setup();
    function Counter() {
      const [count, setCount] = useState(0);
      return <Button label={`Count ${count}`} onPress={() => setCount(count + 1)} />;
    }
    const view = render(
      <ReacdProvider adapter={shadcnAdapter}>
        <PortalActiveContext.Provider value={true}>
          <Popover
            title="Retained"
            triggerLabel="Retained trigger"
            open
            retainContent
            onOpenChange={() => undefined}
          >
            <Counter />
          </Popover>
        </PortalActiveContext.Provider>
      </ReacdProvider>,
    );
    await user.click(await screen.findByRole('button', { name: 'Count 0' }));
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter}>
        <PortalActiveContext.Provider value={false}>
          <Popover
            title="Retained"
            triggerLabel="Retained trigger"
            open
            retainContent
            onOpenChange={() => undefined}
          >
            <Counter />
          </Popover>
        </PortalActiveContext.Provider>
      </ReacdProvider>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    view.rerender(
      <ReacdProvider adapter={shadcnAdapter} templateId="erp-compact">
        <PortalActiveContext.Provider value={true}>
          <Popover
            title="Retained"
            triggerLabel="Retained trigger"
            open
            retainContent
            onOpenChange={() => undefined}
          >
            <Counter />
          </Popover>
        </PortalActiveContext.Provider>
      </ReacdProvider>,
    );
    expect(await screen.findByRole('button', { name: 'Count 1' })).toBeInTheDocument();
  });
  it('dismisses hints before popovers and dialogs with outside focus', async () => {
    const user = userEvent.setup();
    const store = createReacdStore();
    const hintAtom = atom(false);
    const popoverAtom = atom(true);
    function Layers() {
      const [hint, setHint] = useAtom(hintAtom, { store });
      const [open, setOpen] = useAtom(popoverAtom, { store });
      const [dialog, setDialog] = useState(true);
      return (
        <ReacdProvider adapter={shadcnAdapter} store={store}>
          <Modal
            title="Layer parent"
            description="Independent dismissal"
            open={dialog}
            onOpenChange={setDialog}
          >
            <Popover
              title="Layer child"
              triggerLabel="Layer trigger"
              open={open}
              onOpenChange={setOpen}
              dismissible={false}
            >
              <Tooltip text="Layer hint" open={hint} onOpenChange={setHint}>
                <Text>Hint anchor</Text>
              </Tooltip>
              <Button label="Inside action" onPress={() => undefined} />
            </Popover>
            <Button label="Dialog action" onPress={() => undefined} />
          </Modal>
        </ReacdProvider>
      );
    }
    render(<Layers />);
    await screen.findByRole('dialog', { name: 'Layer child' });
    await user.click(screen.getByRole('button', { name: 'Dialog action' }));
    act(() => store.set(hintAtom, true));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Layer hint');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(screen.getByRole('dialog', { name: 'Layer child' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('dialog', { name: 'Layer child' })).toBeInTheDocument();
    await user.click(
      within(screen.getByRole('dialog', { name: 'Layer child' })).getByRole('button', {
        name: 'Close popover',
      }),
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Layer child' })).toBeNull(),
    );
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});

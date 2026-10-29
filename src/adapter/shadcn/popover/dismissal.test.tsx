import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { atom, useAtom } from 'jotai';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import {
  Button,
  Input,
  Popover,
  ReacdProvider,
  Text,
  Tooltip,
  createReacdStore,
} from '../../../index.js';

describe('Popover dismissal boundaries', () => {
  it('respects Escape already handled by a child control', async () => {
    const user = userEvent.setup();
    function Example() {
      const [open, setOpen] = useState(true);
      return (
        <ReacdProvider>
          <Popover
            title="Handled key"
            triggerLabel="Handled trigger"
            open={open}
            onOpenChange={setOpen}
          >
            <Input label="Child field" value="" onValueChange={() => undefined} />
          </Popover>
        </ReacdProvider>
      );
    }
    render(<Example />);
    const field = await screen.findByLabelText('Child field');
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    event.preventDefault();
    fireEvent(field, event);
    expect(screen.getByRole('dialog', { name: 'Handled key' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close popover' }));
  });
  it('dismisses a nested hint from outside focus without a dialog parent', async () => {
    const user = userEvent.setup();
    const store = createReacdStore();
    const hintAtom = atom(false);
    function Example() {
      const [open, setOpen] = useState(true);
      const [hint, setHint] = useAtom(hintAtom, { store });
      return (
        <ReacdProvider store={store}>
          <Popover
            title="Persistent panel"
            triggerLabel="Persistent trigger"
            open={open}
            onOpenChange={setOpen}
            dismissible={false}
          >
            <Tooltip text="Nested persistent hint" open={hint} onOpenChange={setHint}>
              <Text>Hint anchor</Text>
            </Tooltip>
          </Popover>
          <Button label="Outside field action" onPress={() => undefined} />
        </ReacdProvider>
      );
    }
    render(<Example />);
    const popup = await screen.findByRole('dialog', { name: 'Persistent panel' });
    await waitFor(() => expect(popup.contains(document.activeElement)).toBe(true));
    const outside = screen.getByRole('button', { name: 'Outside field action' });
    await user.click(outside);
    await waitFor(() => expect(outside).toHaveFocus());
    act(() => store.set(hintAtom, true));
    await screen.findByRole('tooltip');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(
      screen.getByRole('dialog', { name: 'Persistent panel' }),
    ).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(
      screen.getByRole('dialog', { name: 'Persistent panel' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close popover' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});

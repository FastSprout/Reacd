import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { atom, useAtom } from 'jotai';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  Modal,
  ReacdProvider,
  Text,
  Tooltip,
  createReacdStore,
} from '../../../index.js';
import { PortalActiveContext } from '../../../renderer/theme/portal-context.js';
import { useTooltipAnchor } from './use-tooltip-anchor.js';

describe('shadcn Tooltip', () => {
  it('dismisses a hint before its dialog when focus is elsewhere', async () => {
    const user = userEvent.setup();
    const store = createReacdStore();
    const hintAtom = atom(false);
    function Example() {
      const [dialog, setDialog] = useState(true);
      const [hint, setHint] = useAtom(hintAtom, { store });
      return (
        <ReacdProvider store={store}>
          <Modal
            open={dialog}
            onOpenChange={setDialog}
            title="Escape layers"
            description="Nested dismissal example."
          >
            <Tooltip text="Nested hint" open={hint} onOpenChange={setHint}>
              <Button label="Hint anchor" onPress={() => undefined} />
            </Tooltip>
            <Button label="Outside action" onPress={() => undefined} />
          </Modal>
        </ReacdProvider>
      );
    }
    render(<Example />);
    const outside = await screen.findByRole('button', { name: 'Outside action' });
    await user.click(outside);
    await waitFor(() => expect(outside).toHaveFocus());
    act(() => store.set(hintAtom, true));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Nested hint');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(screen.getByRole('dialog', { name: 'Escape layers' })).toBeVisible();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
  it('opens for static keyboard focus and closes on Escape', async () => {
    const user = userEvent.setup();
    render(
      <ReacdProvider>
        <Tooltip text="Supplementary hint" delay="none">
          <Text>Static anchor</Text>
        </Tooltip>
      </ReacdProvider>,
    );
    const group = screen.getByRole('group', { name: 'Supplementary hint' });
    expect(group).toHaveAttribute('tabindex', '0');
    await user.tab();
    expect(group).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Supplementary hint');
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    await user.keyboard('{Escape}');
  });
  it('preserves actions and adjusts focusability as descendants change', async () => {
    const user = userEvent.setup();
    const press = vi.fn();
    function Example() {
      const [disabled, setDisabled] = useState(false);
      return (
        <ReacdProvider>
          <Tooltip text="Action hint" delay="none" arrow shortcuts={['Control', 'S']}>
            <Button label="Action" disabled={disabled} onPress={press} />
          </Tooltip>
          <Button label="Disable child" onPress={() => setDisabled(true)} />
        </ReacdProvider>
      );
    }
    render(<Example />);
    const group = screen.getByRole('group', { name: 'Action hint' });
    await waitFor(() => expect(group).toHaveAttribute('tabindex', '-1'));
    await user.tab();
    expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Control');
    await user.click(screen.getByRole('button', { name: 'Action' }));
    expect(press).toHaveBeenCalledOnce();
    await user.click(screen.getByRole('button', { name: 'Disable child' }));
    await waitFor(() => expect(group).toHaveAttribute('tabindex', '0'));
  });
  it('supports controlled state, disabling, and retained ancestors', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const view = render(
      <ReacdProvider>
        <Tooltip text="Controlled" open onOpenChange={change} shortcuts={[]}>
          <Text>Anchor</Text>
        </Tooltip>
      </ReacdProvider>,
    );
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Controlled');
    await user.keyboard('{Escape}');
    expect(change).toHaveBeenCalledWith(false);
    view.rerender(
      <ReacdProvider>
        <Tooltip text="Controlled" open onOpenChange={change} disabled>
          <Text>Anchor</Text>
        </Tooltip>
      </ReacdProvider>,
    );
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
    expect(screen.getByRole('group')).toHaveAttribute('tabindex', '-1');
    view.rerender(
      <ReacdProvider>
        <PortalActiveContext.Provider value={false}>
          <Tooltip text="Controlled" open onOpenChange={change}>
            <Text>Anchor</Text>
          </Tooltip>
        </PortalActiveContext.Provider>
      </ReacdProvider>,
    );
    await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  });
  it('observes hidden, untabbable, and disabled descendants', async () => {
    function DetachedProbe() {
      useTooltipAnchor(null);
      return null;
    }
    function Probe() {
      const { ref, tabIndex } = useTooltipAnchor(null);
      return (
        <div ref={ref} data-testid="probe" tabIndex={tabIndex}>
          <input type="hidden" />
          <span tabIndex={-1}>Not a tab stop</span>
          <div hidden>
            <button>Hidden</button>
          </div>
          <button disabled>Disabled</button>
        </div>
      );
    }
    render(
      <>
        <DetachedProbe />
        <div hidden>
          <Probe />
        </div>
      </>,
    );
    const probe = screen.getByTestId('probe');
    await waitFor(() => expect(probe).toHaveAttribute('tabindex', '0'));
    await act(async () => {
      screen.getByText('Not a tab stop').setAttribute('tabindex', '0');
    });
    await waitFor(() => expect(probe).toHaveAttribute('tabindex', '-1'));
  });
});

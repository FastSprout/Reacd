import { shadcnAdapter } from '@fastsprout/reacd-shadcn';
import { atom, useAtom, useAtomValue } from 'jotai';
import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button, ReacdProvider, Toast, createReacdStore } from '../../../index.js';
import { TOAST_DURATIONS } from '../../../core/toast-policy.js';

const UPDATE_STEPS = 20;

afterEach(() => {
  vi.useRealTimers();
});

describe('controlled toast lifecycle edges', () => {
  it('keeps elapsed duration across unrelated host rerenders', () => {
    vi.useFakeTimers();
    const store = createReacdStore();
    const openAtom = atom(true);
    const revisionAtom = atom(0);
    const closed = vi.fn<(open: boolean) => void>();
    const action = vi.fn<() => void>();
    function Scene() {
      const [open, setOpen] = useAtom(openAtom);
      useAtomValue(revisionAtom);
      return (
        <Toast
          title="Timed host updates"
          open={open}
          duration="normal"
          onOpenChange={(next) => {
            closed(next);
            setOpen(next);
          }}
          action={{ label: 'Inspect update', onPress: () => action() }}
        />
      );
    }
    const view = render(
      <ReacdProvider adapter={shadcnAdapter} store={store}>
        <Scene />
      </ReacdProvider>,
    );
    const step = TOAST_DURATIONS.normal / UPDATE_STEPS;
    for (let revision = 1; revision < UPDATE_STEPS; revision++) {
      act(() => {
        vi.advanceTimersByTime(step);
      });
      act(() => {
        store.set(revisionAtom, revision);
      });
      expect(closed).not.toHaveBeenCalled();
    }
    act(() => {
      vi.advanceTimersByTime(step);
    });
    expect(closed.mock.calls).toEqual([[false]]);
    expect(store.get(openAtom)).toBe(false);
    expect(action).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(TOAST_DURATIONS.long);
    });
    expect(closed.mock.calls).toEqual([[false]]);
    view.unmount();
  });

  it.each(['external', 'action'] as const)(
    'restores the origin after a focused %s closure',
    async (mode) => {
      const user = userEvent.setup();
      const store = createReacdStore();
      const openAtom = atom(false);
      const closed = vi.fn<(open: boolean) => void>();
      const action = vi.fn<() => void>();
      function Scene() {
        const [open, setOpen] = useAtom(openAtom);
        return (
          <>
            <Button label="Open lifecycle notice" onPress={() => setOpen(true)} />
            <Toast
              title="External lifecycle closure"
              open={open}
              duration="persistent"
              closeOnAction={false}
              onOpenChange={closed}
              action={{
                label: 'Finish independently',
                onPress: () => {
                  action();
                  setOpen(false);
                },
              }}
            />
          </>
        );
      }
      render(
        <ReacdProvider adapter={shadcnAdapter} store={store}>
          <Scene />
        </ReacdProvider>,
      );
      const origin = screen.getByRole('button', { name: 'Open lifecycle notice' });
      await user.click(origin);
      await user.keyboard('{F6}');
      expect(screen.getByRole('region', { name: 'Notifications' })).toHaveFocus();
      await user.tab();
      expect(
        screen.getByRole('dialog', { name: 'External lifecycle closure' }),
      ).toHaveFocus();
      if (mode === 'external') {
        act(() => {
          store.set(openAtom, false);
        });
      } else {
        await user.tab();
        expect(
          screen.getByRole('button', { name: 'Finish independently' }),
        ).toHaveFocus();
        await user.keyboard('{Enter}');
      }
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      expect(closed).not.toHaveBeenCalled();
      expect(action.mock.calls).toEqual(mode === 'action' ? [[]] : []);
      await waitFor(() => expect(origin).toHaveFocus());
    },
  );
});

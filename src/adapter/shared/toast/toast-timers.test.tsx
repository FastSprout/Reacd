import { activeTestAdapter } from '../../../../test-support/active-test-adapter.js';
import {
  act,
  fireEvent,
  render,
  screen,
} from '../../../../test-support/adapter-testing.js';
import { afterEach, expect, it, vi } from 'vitest';
import { ReacdProvider, Toast } from '../../../index.js';
import { TOAST_DURATIONS } from '../../../core/toast-policy.js';
afterEach(() => {
  vi.useRealTimers();
});
it('automatically dismisses ordinary messages and stops retries when held', () => {
  vi.useFakeTimers();
  const close = vi.fn(() => false);
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Toast title="Timed message" open onOpenChange={close} />
    </ReacdProvider>,
  );
  act(() => {
    vi.advanceTimersByTime(TOAST_DURATIONS.normal);
  });
  expect(close.mock.calls).toEqual([[false]]);
  expect(screen.getByRole('dialog', { name: 'Timed message' })).toBeVisible();
  act(() => {
    vi.advanceTimersByTime(TOAST_DURATIONS.long);
  });
  expect(close).toHaveBeenCalledOnce();
  view.unmount();
});
it('pauses native timers during hover and cleans up without stale callbacks', () => {
  vi.useFakeTimers();
  const close = vi.fn();
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Toast title="Hover message" open onOpenChange={close} />
    </ReacdProvider>,
  );
  const viewport = screen.getByRole('region', { name: 'Notifications' });
  fireEvent.mouseEnter(viewport);
  act(() => {
    vi.advanceTimersByTime(TOAST_DURATIONS.long);
  });
  expect(close).not.toHaveBeenCalled();
  fireEvent.mouseLeave(viewport);
  act(() => {
    vi.advanceTimersByTime(TOAST_DURATIONS.normal);
  });
  expect(close).toHaveBeenCalledWith(false);
  view.unmount();
  const calls = close.mock.calls.length;
  act(() => {
    vi.advanceTimersByTime(TOAST_DURATIONS.long);
  });
  expect(close).toHaveBeenCalledTimes(calls);
});
it('does not expire actionable notifications by default', () => {
  vi.useFakeTimers();
  const close = vi.fn();
  const view = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Toast
        title="Actionable message"
        open
        onOpenChange={close}
        action={{ label: 'Undo', onPress: vi.fn() }}
      />
    </ReacdProvider>,
  );
  act(() => {
    vi.advanceTimersByTime(TOAST_DURATIONS.long);
  });
  expect(close).not.toHaveBeenCalled();
  view.unmount();
});
it('restarts timing only when the declared duration policy changes', () => {
  vi.useFakeTimers();
  const close = vi.fn(() => false);
  const { rerender, unmount } = render(
    <ReacdProvider adapter={activeTestAdapter}>
      <Toast title="Changed duration" open onOpenChange={close} duration="normal" />
    </ReacdProvider>,
  );
  act(() => {
    vi.advanceTimersByTime(TOAST_DURATIONS.normal / 2);
  });
  rerender(
    <ReacdProvider adapter={activeTestAdapter}>
      <Toast title="Changed duration" open onOpenChange={close} duration="long" />
    </ReacdProvider>,
  );
  act(() => {
    vi.advanceTimersByTime(TOAST_DURATIONS.normal);
  });
  expect(close).not.toHaveBeenCalled();
  act(() => {
    vi.advanceTimersByTime(TOAST_DURATIONS.long - TOAST_DURATIONS.normal);
  });
  expect(close.mock.calls).toEqual([[false]]);
  unmount();
});

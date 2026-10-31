import {
  act,
  render,
  renderHook,
  screen,
} from '../../../../test-support/adapter-testing.js';
import { expect, it, vi } from 'vitest';
import { useRangeReset } from './use-range-reset.js';

const initial = { start: '2024-01-01', end: '2024-01-05' };
const replacement = { start: '2024-02-01', end: '2024-02-05' };

it('retains focused segment identity across a native draft reset', async () => {
  function Example() {
    const { ref, revision } = useRangeReset(initial, () => undefined);
    return (
      <form aria-label="Focused">
        <fieldset ref={ref}>
          <input key={revision} role="spinbutton" aria-label="Segment" />
        </fieldset>
      </form>
    );
  }
  render(<Example />);
  screen.getByRole('spinbutton', { name: 'Segment' }).focus();
  await act(async () => {
    screen.getByRole('form', { name: 'Focused' }).dispatchEvent(new Event('reset'));
  });
  expect(screen.getByRole('spinbutton', { name: 'Segment' })).toHaveFocus();
});

it('works without a form or a mounted fieldset', () => {
  const request = vi.fn();
  const hook = renderHook(() => useRangeReset(initial, request));
  act(() => hook.result.current.change(replacement));
  expect(request).toHaveBeenCalledExactlyOnceWith(replacement);
  function Detached() {
    const { ref } = useRangeReset(initial, request);
    return (
      <fieldset ref={ref}>
        <legend>Detached</legend>
      </fieldset>
    );
  }
  render(<Detached />);
  expect(screen.getByRole('group', { name: 'Detached' })).toBeInTheDocument();
});

it('uses latest request, suppresses endpoints and reconciles identity', async () => {
  const first = vi.fn();
  const latest = vi.fn();
  function Example({ request = first }) {
    const { ref, revision, change } = useRangeReset(initial, request);
    return (
      <form aria-label="Host" onReset={() => change(replacement)}>
        <fieldset ref={ref}>
          <legend>Range</legend>
          <output>{revision}</output>
        </fieldset>
      </form>
    );
  }
  const view = render(<Example />);
  view.rerender(<Example request={latest} />);
  await act(async () => {
    screen
      .getByRole('form', { name: 'Host' })
      .dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }));
  });
  expect(first).not.toHaveBeenCalled();
  expect(latest).toHaveBeenCalledExactlyOnceWith(initial);
  expect(screen.getByRole('status')).toHaveTextContent('1');
});

it('honors reset cancellation without canceling it itself', async () => {
  const request = vi.fn();
  function Example() {
    const { ref, revision } = useRangeReset(initial, request);
    return (
      <form onReset={(event) => event.preventDefault()} aria-label="Canceled">
        <fieldset ref={ref}>
          <output>{revision}</output>
        </fieldset>
      </form>
    );
  }
  render(<Example />);
  await act(async () => {
    screen
      .getByRole('form', { name: 'Canceled' })
      .dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }));
  });
  expect(request).not.toHaveBeenCalled();
  expect(screen.getByRole('status')).toHaveTextContent('0');
});

it('keeps reset requests distinct and releases its native listener', async () => {
  const request = vi.fn();
  function Example() {
    const { ref } = useRangeReset(initial, request);
    return (
      <form aria-label="Host">
        <fieldset ref={ref} />
      </form>
    );
  }
  const view = render(<Example />);
  const form = screen.getByRole('form', { name: 'Host' });
  await act(async () => {
    form.dispatchEvent(new Event('reset'));
    form.dispatchEvent(new Event('reset'));
  });
  expect(request).toHaveBeenCalledTimes(2);
  expect(request.mock.calls).toEqual([[initial], [initial]]);
  request.mockClear();
  await act(async () => {
    form.dispatchEvent(new Event('reset'));
    view.unmount();
  });
  expect(request).not.toHaveBeenCalled();
  form.dispatchEvent(new Event('reset'));
  expect(request).not.toHaveBeenCalled();
});

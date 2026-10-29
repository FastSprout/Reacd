import { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSplitterDrag } from './use-splitter-drag.js';
import { installLayout } from '../../../test-support/layout-observer.js';

const panels = [
  { id: 'first', minShare: 20, maxShare: 80 },
  { id: 'second', minShare: 20, maxShare: 80 },
];
const value = [
  { id: 'first', share: 50 },
  { id: 'second', share: 50 },
];
const change = vi.fn();
let restore: () => void;
beforeEach(() => {
  restore = installLayout(1000);
  change.mockClear();
});
afterEach(() => {
  restore();
  vi.restoreAllMocks();
});

function Scene({
  index = 0,
  disabled = false,
  missing = false,
  orientation = 'horizontal',
  direction = 'ltr',
}: {
  index?: number;
  disabled?: boolean;
  missing?: boolean;
  orientation?: 'horizontal' | 'vertical';
  direction?: 'ltr' | 'rtl';
}) {
  const reference = useRef<HTMLDivElement>(null);
  const missingRef = useRef<HTMLElement>(null);
  const drag = useSplitterDrag({
    reference: missing ? missingRef : reference,
    panels,
    value,
    onValueChange: change,
    orientation,
    direction,
    disabled,
  });
  return (
    <div ref={reference} data-testid="group" data-dragging={drag.dragging}>
      <div
        role="separator"
        tabIndex={0}
        onPointerDown={(event) => drag.start(event, index)}
        onPointerMove={drag.move}
        onPointerUp={drag.finish}
        onPointerCancel={drag.cancel}
        onLostPointerCapture={drag.cancel}
        onBlur={drag.cancel}
      />
    </div>
  );
}

function start() {
  fireEvent.pointerDown(screen.getByRole('separator'), {
    pointerId: 1,
    button: 0,
    clientX: 100,
    clientY: 100,
  });
}
function move(pointerId = 1) {
  fireEvent.pointerMove(screen.getByRole('separator'), {
    pointerId,
    clientX: 200,
    clientY: 200,
  });
}

describe('captured pointer resizing lifecycle', () => {
  it('does not update an incomplete pair after acquiring capture', () => {
    render(<Scene index={9} />);
    start();
    expect(screen.getByTestId('group')).toHaveAttribute('data-dragging', 'true');
    move();
    expect(change).not.toHaveBeenCalled();
  });
  it('moves only the active pointer, cancels atomically and releases capture', () => {
    const capture = vi.spyOn(HTMLElement.prototype, 'setPointerCapture');
    vi.spyOn(HTMLElement.prototype, 'hasPointerCapture').mockReturnValue(true);
    const release = vi.spyOn(HTMLElement.prototype, 'releasePointerCapture');
    render(<Scene />);
    move();
    expect(change).not.toHaveBeenCalled();
    start();
    expect(capture).toHaveBeenCalledWith(1);
    move(2);
    expect(change).not.toHaveBeenCalled();
    move();
    expect(change).toHaveBeenLastCalledWith([
      { id: 'first', share: 60 },
      { id: 'second', share: 40 },
    ]);
    fireEvent.pointerCancel(screen.getByRole('separator'), { pointerId: 1 });
    expect(change).toHaveBeenLastCalledWith(value);
    expect(release).toHaveBeenCalledWith(1);
    expect(screen.getByTestId('group')).toHaveAttribute('data-dragging', 'false');
    fireEvent.pointerUp(screen.getByRole('separator'));
    fireEvent.pointerCancel(screen.getByRole('separator'));
  });

  it('preserves completion, restores lost captures and rolls back focus loss', () => {
    render(<Scene />);
    start();
    move();
    fireEvent.pointerUp(screen.getByRole('separator'));
    expect(change).toHaveBeenLastCalledWith([
      { id: 'first', share: 60 },
      { id: 'second', share: 40 },
    ]);
    start();
    move();
    fireEvent.lostPointerCapture(screen.getByRole('separator'));
    expect(change).toHaveBeenLastCalledWith(value);
    start();
    move();
    fireEvent.blur(screen.getByRole('separator'));
    expect(change).toHaveBeenLastCalledWith(value);
  });

  it('releases on unmount and cancels when resizing becomes disabled', () => {
    vi.spyOn(HTMLElement.prototype, 'hasPointerCapture').mockReturnValue(true);
    const release = vi.spyOn(HTMLElement.prototype, 'releasePointerCapture');
    const view = render(<Scene />);
    start();
    move();
    view.rerender(<Scene disabled />);
    expect(change).toHaveBeenLastCalledWith(value);
    start();
    expect(release).toHaveBeenCalledTimes(1);
    view.rerender(<Scene />);
    start();
    view.unmount();
    expect(release).toHaveBeenCalledTimes(2);
  });

  it('ignores missing geometry, missing pairs and secondary pointer buttons', () => {
    const view = render(<Scene missing />);
    start();
    move();
    expect(change).not.toHaveBeenCalled();
    view.rerender(<Scene />);
    fireEvent.pointerDown(screen.getByRole('separator'), { button: 2 });
    expect(change).not.toHaveBeenCalled();
    const zero = vi
      .spyOn(screen.getByTestId('group'), 'getBoundingClientRect')
      .mockReturnValue(new DOMRect());
    start();
    expect(change).not.toHaveBeenCalled();
    zero.mockRestore();
    view.rerender(<Scene index={9} />);
    start();
    move();
    expect(change).not.toHaveBeenCalled();
  });

  it('uses the correct axis and logical horizontal direction', () => {
    const view = render(<Scene direction="rtl" />);
    start();
    move();
    expect(change).toHaveBeenLastCalledWith([
      { id: 'first', share: 40 },
      { id: 'second', share: 60 },
    ]);
    fireEvent.pointerUp(screen.getByRole('separator'));
    view.rerender(<Scene orientation="vertical" />);
    start();
    move();
    expect(change).toHaveBeenLastCalledWith([
      { id: 'first', share: 75 },
      { id: 'second', share: 25 },
    ]);
  });
});

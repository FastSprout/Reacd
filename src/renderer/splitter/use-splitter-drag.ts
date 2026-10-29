import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent, RefObject } from 'react';
import type { PanelConstraint, PanelShare } from '../../core/splitter.js';
import { resizePair } from '../../core/splitter.js';
import { SPLITTER_POLICY } from '../../core/splitter-policy.js';

interface DragSession {
  pointerId: number;
  handle: HTMLElement;
  origin: number;
  extent: number;
  index: number;
  original: readonly PanelShare[];
}

export function useSplitterDrag({
  reference,
  panels,
  value,
  orientation,
  direction,
  onValueChange,
  disabled,
}: {
  reference: RefObject<HTMLElement | null>;
  panels: readonly PanelConstraint[];
  value: readonly PanelShare[];
  orientation: 'horizontal' | 'vertical';
  direction: 'ltr' | 'rtl';
  onValueChange: (value: readonly PanelShare[]) => void;
  disabled: boolean;
}) {
  const session = useRef<DragSession | null>(null);
  const [dragging, setDragging] = useState(false);
  const release = useCallback(() => {
    const current = session.current;
    if (!current) return;
    session.current = null;
    if (current.handle.hasPointerCapture(current.pointerId))
      current.handle.releasePointerCapture(current.pointerId);
    setDragging(false);
  }, []);
  useEffect(
    () => () => {
      const current = session.current;
      if (current?.handle.hasPointerCapture(current.pointerId))
        current.handle.releasePointerCapture(current.pointerId);
    },
    [],
  );
  const cancel = useCallback(() => {
    const current = session.current;
    if (!current) return;
    onValueChange(current.original);
    release();
  }, [onValueChange, release]);
  useEffect(() => {
    if (disabled) cancel();
  }, [disabled, cancel]);
  return {
    dragging,
    cancel,
    finish: release,
    start: (event: PointerEvent<HTMLElement>, index: number) => {
      const element = reference.current;
      if (disabled || event.button !== 0 || !element) return;
      const box = element.getBoundingClientRect();
      const extent = orientation === 'horizontal' ? box.width : box.height;
      if (extent <= 0) return;
      event.preventDefault();
      event.currentTarget.focus();
      event.currentTarget.setPointerCapture(event.pointerId);
      session.current = {
        pointerId: event.pointerId,
        handle: event.currentTarget,
        origin: orientation === 'horizontal' ? event.clientX : event.clientY,
        extent,
        index,
        original: value,
      };
      setDragging(true);
    },
    move: (event: PointerEvent<HTMLElement>) => {
      const current = session.current;
      if (!current || event.pointerId !== current.pointerId) return;
      const primary = current.original[current.index];
      if (!primary) return;
      const coordinate = orientation === 'horizontal' ? event.clientX : event.clientY;
      const sign = orientation === 'horizontal' && direction === 'rtl' ? -1 : 1;
      const delta =
        ((coordinate - current.origin) / current.extent) * SPLITTER_POLICY.total * sign;
      onValueChange(
        resizePair(panels, current.original, current.index, primary.share + delta),
      );
    },
  };
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { TemporalRange } from
  '@fastsprout/reacd/adapter-runtime/core/date-time.js';
import { captureRangeFocus } from './range-reset-focus.js';

export function useRangeReset(
  value: TemporalRange,
  request: (value: TemporalRange) => void,
) {
  const initial = useRef(Object.freeze({ start: value.start, end: value.end }));
  const latest = useRef(request);
  const [fieldset, setFieldset] = useState<HTMLFieldSetElement | null>(null);
  const pending = useRef<Event | null>(null);
  const restoreFocus = useRef<(() => void) | undefined>(undefined);
  const [revision, setRevision] = useState(0);
  useLayoutEffect(() => {
    latest.current = request;
  }, [request]);
  useLayoutEffect(() => {
    const restore = restoreFocus.current;
    if (restore !== undefined) {
      restoreFocus.current = undefined;
      queueMicrotask(restore);
    }
  }, [revision]);
  useEffect(() => {
    if (fieldset === null) return;
    const root = fieldset;
    const form = root.form;
    if (form === null) return;
    let active = true;
    function capture(event: Event) {
      const restore = captureRangeFocus(root);
      pending.current = event;
      queueMicrotask(() => {
        if (!active) return;
        pending.current = null;
        if (!event.defaultPrevented) {
          // Reconcile SDK drafts to host authority even when reset is declined.
          restoreFocus.current = restore;
          setRevision((current) => current + 1);
          latest.current(initial.current);
        }
      });
    }
    form.addEventListener('reset', capture, true);
    return () => {
      active = false;
      pending.current = null;
      form.removeEventListener('reset', capture, true);
    };
  }, [fieldset]);
  function change(next: TemporalRange) {
    if (pending.current === null) request(next);
  }
  return { ref: setFieldset, revision, change };
}

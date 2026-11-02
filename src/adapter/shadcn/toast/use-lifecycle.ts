import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { ToastProps } from
  '@fastsprout/reacd/adapter-runtime/components/toast/toast.props.js';
import { TOAST_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';
import { toastFeedback } from './decision.js';
import type { ToastFeedback } from './decision.js';

export function useToastLifecycle(properties: ToastProps, active: boolean) {
  const latest = useRef<ToastProps | null>(null);
  const persistent = useRef(false);
  const interactive = useRef(false);
  const foreignEscape = useRef(false);
  const [held, setHeld] = useState(false);
  const [feedback, setFeedback] = useState<ToastFeedback | null>(null);
  const [previousOpen, setPreviousOpen] = useState(properties.open);
  if (previousOpen !== properties.open) {
    setPreviousOpen(properties.open);
    setHeld(false);
    setFeedback(null);
  }
  useLayoutEffect(() => {
    latest.current = active ? properties : null;
    if (!properties.open) {
      persistent.current = false;
      interactive.current = false;
    }
    return () => { latest.current = null; };
  }, [properties, active]);

  const request = useCallback(() => {
    const props = latest.current;
    if (!props?.open) return;
    persistent.current = true;
    setHeld(true);
    setFeedback(toastFeedback(() => props.onOpenChange(false)));
  }, []);
  const nativeChange = useCallback(() => {
    if (foreignEscape.current) {
      foreignEscape.current = false;
      return;
    }
    const manual = interactive.current;
    interactive.current = false;
    if (!persistent.current || manual) request();
  }, [request]);
  const markInteractive = useCallback(() => { interactive.current = true; }, []);
  const nativeEscape = useCallback((owned: boolean, within: boolean,
    prevented: boolean) => {
    if (prevented) return;
    // Radix synchronously follows a foreign Escape with this provider's close.
    if (!within) foreignEscape.current = true;
    else if (owned) interactive.current = true;
  }, []);
  const invokeAction = useCallback(() => {
    const props = latest.current;
    const action = props?.action;
    if (!props?.open || !action) return false;
    const issue = toastFeedback(() => action.onPress());
    setFeedback(issue);
    if (issue !== null) {
      persistent.current = true;
      setHeld(true);
      return false;
    }
    const close = props.closeOnAction ?? TOAST_DEFAULTS.closeOnAction;
    if (close) interactive.current = true;
    return close;
  }, []);
  return { held, feedback, nativeChange, nativeEscape, markInteractive, invokeAction };
}

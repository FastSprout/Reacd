import { useAtomValue } from 'jotai';
import { useToastQueue } from './toast-queue-context.js';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Toast } from '@base-ui/react/toast';
import type { ToastProps } from
  '@fastsprout/reacd/adapter-runtime/components/toast/index.js';
import {
  TOAST_DEFAULTS,
  TOAST_POLICY,
  TOAST_DURATIONS,
  toastDecision,
  toastTimeout,
} from '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';
import type { ToastData, ToastFeedback } from './toast-data.js';

export function ToastRegistration({
  id,
  properties,
  variables,
  direction,
  host,
}: {
  id: string;
  properties: ToastProps;
  variables: CSSProperties;
  direction: 'ltr' | 'rtl';
  host: HTMLElement | null;
}) {
  const { toasts, add, update, close } = Toast.useToastManager<ToastData>();
  const queue = useToastQueue();
  const slots = useAtomValue(queue.keys, { store: queue.store });
  const current = toasts.find((toast) => toast.id === id);
  const full = !slots.has(id) && slots.size >= TOAST_POLICY.maximumQueued;
  const [feedback, setFeedback] = useState<ToastFeedback | null>(null);
  const [held, setHeld] = useState(false);
  const alive = useRef(false);
  const forwarding = useRef(false);
  const snapshot = useRef(toasts);
  useLayoutEffect(() => {
    snapshot.current = toasts;
  }, [toasts]);
  const latest = useRef(properties.onOpenChange);
  useLayoutEffect(() => {
    latest.current = properties.onOpenChange;
  }, [properties.onOpenChange]);
  const requestClose = useCallback(() => {
    if (!alive.current) return;
    setHeld(true);
    let result: unknown;
    try {
      result = latest.current(false);
    } catch {
      setFeedback('actionError');
      return;
    }
    const decision = toastDecision(result);
    if (decision === 'invalid') setFeedback('invalid');
    else if (decision === 'veto') setFeedback('rejected');
    else {
      forwarding.current = true;
      try {
        close(id);
      } finally {
        forwarding.current = false;
      }
    }
  }, [close, id]);
  const nativeClose = useCallback(() => {
    if (!forwarding.current) requestClose();
  }, [requestClose]);
  const action = useMemo(() => {
    const declared = properties.action;
    if (declared === undefined) return undefined;
    return {
      label: declared.label,
      execute: () => {
        let result: unknown;
        try {
          result = declared.onPress();
        } catch {
          setFeedback('actionError');
          return;
        }
        const decision = toastDecision(result);
        if (decision === 'invalid') setFeedback('invalid');
        else if (decision === 'veto') setFeedback('rejected');
        else {
          setFeedback(null);
          if (properties.closeOnAction ?? TOAST_DEFAULTS.closeOnAction) requestClose();
        }
      },
    };
  }, [properties.action, properties.closeOnAction, requestClose]);
  const options = useMemo(
    () => ({
      id,
      title: properties.title,
      description: properties.description,
      type: properties.intent ?? TOAST_DEFAULTS.intent,
      priority:
        (properties.priority ?? TOAST_DEFAULTS.priority) === 'urgent'
          ? ('high' as const)
          : ('low' as const),
      timeout:
        held || feedback !== null
          ? TOAST_DURATIONS.persistent
          : toastTimeout(properties.duration, properties.action !== undefined),
      onClose: nativeClose,
      data: {
        variables,
        direction,
        feedback,
        host,
        intent: properties.intent ?? TOAST_DEFAULTS.intent,
        description: properties.description,
        closeLabel: properties.closeLabel ?? TOAST_DEFAULTS.closeLabel,
        requestClose,
        action,
      },
    }),
    [
      id,
      properties.title,
      properties.description,
      properties.intent,
      properties.priority,
      properties.duration,
      action,
      properties.action,
      properties.closeLabel,
      held,
      feedback,
      variables,
      direction,
      host,
      requestClose,
      nativeClose,
    ],
  );
  useLayoutEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      queue.focus.close(id, snapshot.current, () => close(id));
      queue.release(id);
    };
  }, [close, id, queue]);
  const present = current !== undefined;
  const phase = current?.transitionStatus;
  const currentTimeout = current?.timeout;
  useLayoutEffect(() => {
    if (full || !queue.reserve(id)) return;
    if (!present || phase === 'ending') add(options);
    else if (currentTimeout !== options.timeout) update(id, options);
    else {
      const { timeout: _timeout, ...metadata } = options;
      update(id, metadata);
    }
  }, [queue, full, phase, present, currentTimeout, add, update, id, options]);
  return full ? <p role="alert">{TOAST_DEFAULTS.limit}</p> : null;
}

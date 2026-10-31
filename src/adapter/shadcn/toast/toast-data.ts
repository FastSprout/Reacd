import type { CSSProperties } from 'react';
import type { ToastProps } from
  '@fastsprout/reacd/adapter-runtime/components/toast/index.js';
export type ToastFeedback = 'rejected' | 'invalid' | 'actionError';
export interface ToastData {
  variables: CSSProperties;
  host: HTMLElement | null;
  direction: 'ltr' | 'rtl';
  intent: NonNullable<ToastProps['intent']>;
  description?: string | undefined;
  closeLabel: string;
  requestClose: () => void;
  feedback: ToastFeedback | null;
  action?: { label: string; execute: () => void } | undefined;
}

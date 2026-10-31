import { useState } from 'react';
import type { ReactNode } from 'react';
import { Toast } from '@base-ui/react/toast';
import { TOAST_POLICY } from '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';
import { createToastQueue } from './toast-queue.js';
import { ToastQueueContext } from './toast-queue-context.js';
import { ShadcnToastViewport } from './toast-viewport.js';
export function ShadcnToastProvider({ children }: { children: ReactNode }) {
  const [queue] = useState(createToastQueue);
  return (
    <ToastQueueContext.Provider value={queue}>
      <Toast.Provider limit={TOAST_POLICY.maximumVisible}>
        {children}
        <ShadcnToastViewport />
      </Toast.Provider>
    </ToastQueueContext.Provider>
  );
}

import { createContext, useContext } from 'react';
import type { createToastQueue } from './toast-queue.js';
export const ToastQueueContext = createContext<ReturnType<
  typeof createToastQueue
> | null>(null);
export function useToastQueue() {
  const queue = useContext(ToastQueueContext);
  if (queue === null)
    throw new Error('Toast requires a Surface notification provider.');
  return queue;
}

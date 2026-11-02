import { createContext, useContext, useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import { toastAdmission } from './admission.js';

export interface ToastAdmissionScope {
  readonly ids: readonly string[];
  readonly reserve: (id: string) => void;
  readonly release: (id: string) => void;
  readonly viewport: RefObject<HTMLOListElement | null>;
}
export const ToastAdmissionContext = createContext<ToastAdmissionScope | null>(null);

export function useToastScope() {
  const scope = useContext(ToastAdmissionContext);
  if (!scope) throw new Error('Toast requires the native shadcn Surface.');
  return scope;
}

export function useToastAdmission(id: string, open: boolean) {
  const { ids, reserve, release } = useToastScope();
  const status = toastAdmission(ids, id);
  useLayoutEffect(() => {
    if (!open) return;
    reserve(id);
    return () => release(id);
  }, [open, id, reserve, release]);
  useLayoutEffect(() => {
    if (open && status === 'waiting') reserve(id);
  }, [open, status, id, reserve]);
  return status;
}

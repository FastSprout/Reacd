import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { PortalHostContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { ToastProvider } from '../vendor/ui/toast.js';
import { releaseAdmission, reserveAdmission } from './admission.js';
import { ToastAdmissionContext } from './scope.js';
import { NativeToastViewport } from './viewport.js';
import { NATIVE_TOAST_POLICY } from './native-policy.js';

export function NativeToastSurface({ children }: { readonly children: ReactNode }) {
  const [ids, setIds] = useState<readonly string[]>([]);
  const host = useContext(PortalHostContext);
  const viewport = useRef<HTMLOListElement | null>(null);
  const reserve = useCallback((id: string) => {
    setIds(previous => reserveAdmission(previous, id));
  }, []);
  const release = useCallback((id: string) => {
    setIds(previous => releaseAdmission(previous, id));
  }, []);
  const scope = useMemo(() => ({ ids, reserve, release, viewport }),
    [ids, reserve, release]);
  return <ToastAdmissionContext value={scope}>
    <ToastProvider duration={NATIVE_TOAST_POLICY.persistentDuration}
      announcerContainer={host ?? undefined}>
      {children}
      {ids.length > 0 && <NativeToastViewport viewport={viewport} />}
    </ToastProvider>
  </ToastAdmissionContext>;
}

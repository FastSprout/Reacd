import { TOAST_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';
import { ToastViewport } from '../vendor/ui/toast.js';
import { useShadcnTheme } from '../surface/theme-context.js';
import { NATIVE_TOAST_POLICY } from './native-policy.js';
import type { ToastAdmissionScope } from './scope.js';

const hotkey = [NATIVE_TOAST_POLICY.viewportHotkey];

export function NativeToastViewport({ viewport }: {
  readonly viewport: ToastAdmissionScope['viewport'];
}) {
  const theme = useShadcnTheme();
  return <ToastViewport ref={viewport} role="region" aria-label="Notifications"
    label="Notification navigation" hotkey={hotkey}
    className="inset-x-0 top-auto bottom-0 flex-col outline-none"
    style={{ ...theme, maxInlineSize: '100%', maxBlockSize: '100dvh',
      padding: 'var(--space-medium)', gap: 'var(--space-small)',
      overflowY: 'auto', zIndex: TOAST_POLICY.layer }} />;
}

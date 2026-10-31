import { useToastQueue } from './toast-queue-context.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import { useContext } from 'react';
import { Toast } from '@base-ui/react/toast';
import { TOAST_DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';
import { PortalHostContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import type { ToastData } from './toast-data.js';
import { Button } from '../vendor/ui/button.js';

export function ShadcnToastViewport() {
  const queue = useToastQueue();
  const { toasts } = Toast.useToastManager<ToastData>();
  const fallbackHost = useContext(PortalHostContext);
  const variables = useContext(ThemeVariablesContext);
  const active = toasts.find(
    (toast) => toast.data !== undefined && toast.transitionStatus !== 'ending',
  );
  const host = active?.data?.host ?? fallbackHost;
  if (toasts.length === 0) return null;
  return (
    <Toast.Portal container={host ?? undefined}>
      <Toast.Viewport
        onFocusCapture={(event) =>
          queue.focus.remember(event.currentTarget, event.relatedTarget)
        }
        style={variables}
        className="reacd-root reacd-portal-root reacd-toast-viewport"
      >
        {toasts.map((toast) => {
          const data = toast.data;
          if (data === undefined) return null;
          const action = data.action;
          return (
            <Toast.Root
              key={toast.id}
              toast={toast}
              onKeyDown={(event) => {
                if (event.key !== 'Escape') return;
                event.preventBaseUIHandler();
                event.preventDefault();
                event.stopPropagation();
                data.requestClose();
              }}
              className="reacd-root reacd-portal-root reacd-toast"
              data-intent={data.intent}
              dir={data.direction}
              style={data.variables}
              swipeDirection={
                data.direction === 'rtl' ? ['down', 'left'] : ['down', 'right']
              }
            >
              <div className="reacd-toast-grip" aria-hidden="true">
                <span />
              </div>
              <Toast.Content className="reacd-toast-content" data-base-ui-swipe-ignore>
                <Toast.Title className="reacd-toast-title" />
                {data.description !== undefined && <Toast.Description />}
                {data.feedback !== null && (
                  <p role={data.feedback === 'rejected' ? 'status' : 'alert'}>
                    {TOAST_DEFAULTS[data.feedback]}
                  </p>
                )}
                <div className="reacd-toast-actions">
                  {action !== undefined && (
                    <Toast.Action
                      onClick={() => action.execute()}
                      render={<Button className="reacd-node reacd-button" />}
                    >
                      {action.label}
                    </Toast.Action>
                  )}
                  <Toast.Close
                    onClick={(event) => {
                      event.preventBaseUIHandler();
                      event.preventDefault();
                      data.requestClose();
                    }}
                    render={
                      <Button variant="secondary" className="reacd-node reacd-button" />
                    }
                  >
                    {data.closeLabel}
                  </Toast.Close>
                </div>
              </Toast.Content>
            </Toast.Root>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

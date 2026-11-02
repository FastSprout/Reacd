import { Close } from '@radix-ui/react-toast';
import type { ToastProps } from
  '@fastsprout/reacd/adapter-runtime/components/toast/toast.props.js';
import { TOAST_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';
import { ToastAction } from '../vendor/ui/toast.js';
import { Button } from '../vendor/ui/button.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import type { useToastLifecycle } from './use-lifecycle.js';

type Lifecycle = ReturnType<typeof useToastLifecycle>;
export function NativeToastButtons({ properties, lifecycle }: {
  readonly properties: ToastProps;
  readonly lifecycle: Lifecycle;
}) {
  return <>
    {properties.action && <ToastAction asChild altText={properties.action.label}
      onClick={event => {
        if (!lifecycle.invokeAction()) event.preventDefault();
      }}>
      <Button type="button" variant="outline" className={WRAPPING_BUTTON_CLASSES}>
        {properties.action.label}
      </Button>
    </ToastAction>}
    <Close asChild onClick={lifecycle.markInteractive}>
      <Button type="button" variant="outline" className={WRAPPING_BUTTON_CLASSES}>
        {properties.closeLabel ?? TOAST_DEFAULTS.closeLabel}
      </Button>
    </Close>
  </>;
}

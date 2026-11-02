import { useDirection } from '@radix-ui/react-direction';
import { useRef } from 'react';
import type { ToastProps } from
  '@fastsprout/reacd/adapter-runtime/components/toast/toast.props.js';
import { TOAST_DEFAULTS, TOAST_POLICY, toastTimeout } from
  '@fastsprout/reacd/adapter-runtime/core/toast-policy.js';
import { LAYOUT_POLICY } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Toast, ToastDescription, ToastTitle } from '../vendor/ui/toast.js';
import { CardContent } from '../vendor/ui/card.js';
import { FieldDescription, FieldError } from '../vendor/ui/field.js';
import { Separator } from '../vendor/ui/separator.js';
import { ScrollArea } from '../vendor/ui/scroll-area.js';
import { ShadcnIcon } from '../icon/icon.adapter.js';
import { useShadcnTheme } from '../surface/theme-context.js';
import { NativeToastButtons } from './buttons.js';
import { NATIVE_TOAST_POLICY } from './native-policy.js';
import { useToastScope } from './scope.js';
import type { useToastLifecycle } from './use-lifecycle.js';

const icons = { neutral: 'info', success: 'success', danger: 'error' } as const;
export function NativeToastCard({ properties, lifecycle, id, visible }: {
  readonly properties: ToastProps;
  readonly lifecycle: ReturnType<typeof useToastLifecycle>;
  readonly id: string;
  readonly visible: boolean;
}) {
  const direction = useDirection();
  const root = useRef<HTMLLIElement | null>(null);
  const { viewport } = useToastScope();
  const theme = useShadcnTheme();
  const intent = properties.intent ?? TOAST_DEFAULTS.intent;
  const urgent = properties.priority === 'urgent';
  const timeout = toastTimeout(properties.duration, properties.action !== undefined);
  const duration = lifecycle.held || timeout === 0
    ? NATIVE_TOAST_POLICY.persistentDuration : timeout;
  return <Toast ref={root} open={visible} onOpenChange={lifecycle.nativeChange}
    duration={duration} type={urgent ? 'foreground' : 'background'}
    variant={intent === 'danger' ? 'destructive' : 'default'}
    role={urgent ? 'alertdialog' : 'dialog'} dir={direction}
    aria-labelledby={`${id}-title`}
    aria-describedby={properties.description ? `${id}-description` : undefined}
    onEscapeKeyDown={event => {
      const path = event.composedPath();
      lifecycle.nativeEscape(
        path.some(target => target === root.current)
          || event.target === viewport.current,
        path.some(target => target === viewport.current),
        event.defaultPrevented,
      );
    }}
    onSwipeEnd={lifecycle.markInteractive}
    className={[
      'grid min-h-0 min-w-0 shrink-0 grid-cols-1 items-stretch gap-2 space-x-0 p-0',
      'grid-rows-[auto_minmax(0,1fr)] motion-reduce:animate-none!',
      'motion-reduce:transition-none',
      lifecycle.held
        ? 'data-[swipe=end]:translate-x-0 data-[swipe=end]:animate-none!' : '',
    ].join(' ')}
    style={{ ...theme, maxInlineSize: `${TOAST_POLICY.widthRem}rem`,
      marginInlineStart: 'auto', touchAction: 'auto',
      maxBlockSize: `${TOAST_POLICY.maximumBlockViewportPercent}dvh` }}>
    <CardContent data-toast-grip aria-hidden className="grid place-items-center p-0"
      style={{ minBlockSize: LAYOUT_POLICY.controlTargetPx, touchAction: 'none' }}>
      <Separator style={{ inlineSize: `${TOAST_POLICY.gripWidthRem}rem`,
        blockSize: TOAST_POLICY.gripBlockPx }} />
    </CardContent>
    <ScrollArea className="min-h-0 min-w-0"
      viewportProps={{ role: 'region', tabIndex: 0,
        'aria-label': `${properties.title} content` }}>
      <CardContent className="grid min-w-0 grid-cols-1 gap-3 p-4"
        onPointerDown={event => event.stopPropagation()}>
        <ShadcnIcon name={icons[intent]} decorative />
        <ToastTitle id={`${id}-title`} className="[overflow-wrap:anywhere]">
          {properties.title}
        </ToastTitle>
        {properties.description && <ToastDescription id={`${id}-description`}
          className="[overflow-wrap:anywhere]">{properties.description}
        </ToastDescription>}
        {lifecycle.feedback === 'rejected' ? <FieldDescription role="status">
          {TOAST_DEFAULTS.rejected}
        </FieldDescription> : lifecycle.feedback && <FieldError>
          {TOAST_DEFAULTS[lifecycle.feedback]}
        </FieldError>}
        <NativeToastButtons properties={properties} lifecycle={lifecycle} />
      </CardContent>
    </ScrollArea>
  </Toast>;
}

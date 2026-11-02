import { useDirection } from '@radix-ui/react-direction';
import { useNativePopup } from '../surface/use-native-popup.js';
import type { TooltipProps } from
  '@fastsprout/reacd/adapter-runtime/components/tooltip/tooltip.props.js';
import {
  TOOLTIP_DEFAULTS,
  TOOLTIP_DELAYS,
  TOOLTIP_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/tooltip-policy.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../vendor/ui/tooltip.js';
import { CardContent } from '../vendor/ui/card.js';
import { Kbd, KbdGroup } from '../vendor/ui/kbd.js';
import { useShadcnTheme } from '../surface/theme-context.js';

export type ShadcnTooltipProps = TooltipProps;
export function ShadcnTooltip({
  text,
  children,
  open,
  onOpenChange,
  disabled,
  placement = TOOLTIP_DEFAULTS.placement,
  delay = TOOLTIP_DEFAULTS.delay,
  arrow = TOOLTIP_DEFAULTS.arrow,
  shortcuts,
}: TooltipProps) {
  const direction = useDirection();
  const popup = useNativePopup(!disabled);
  const theme = useShadcnTheme();
  const sides = {
    top: 'top',
    bottom: 'bottom',
    'inline-start': direction === 'rtl' ? 'right' : 'left',
    'inline-end': direction === 'rtl' ? 'left' : 'right',
  } as const;
  return (
    <TooltipProvider delayDuration={TOOLTIP_DELAYS[delay]}>
      <Tooltip
        open={popup.active ? (open ?? popup.open) : false}
        onOpenChange={(next) => {
          if (popup.active) {
            popup.onOpenChange(next);
            onOpenChange?.(next);
          }
        }}
      >
        <TooltipTrigger asChild>
          <CardContent tabIndex={0} className="inline-flex p-0">
            {children}
          </CardContent>
        </TooltipTrigger>
        <TooltipContent
          container={popup.host}
          side={sides[placement]}
          sideOffset={TOOLTIP_POLICY.sideOffsetPx}
          collisionPadding={TOOLTIP_POLICY.collisionPaddingPx}
          style={{
            ...theme,
            maxInlineSize:
              `min(${TOOLTIP_POLICY.widthRem}rem, ` +
              'var(--radix-tooltip-content-available-width))',
            maxBlockSize: 'var(--radix-tooltip-content-available-height)',
            overflowWrap: 'anywhere',
            whiteSpace: 'normal',
            overflowY: 'visible',
          }}
          dir={direction}
          showArrow={arrow}
          className="motion-reduce:animate-none"
        >
          <CardContent
            data-reacd-tooltip-scroll
            className="p-0"
            style={{
              overflowY: 'auto',
              overflowWrap: 'anywhere',
              maxBlockSize:
                'calc(var(--radix-tooltip-content-available-height) - ' +
                `${TOOLTIP_POLICY.arrowRem * 2}rem)`,
            }}
          >
            {text}
            {shortcuts && (
              <KbdGroup>
                {shortcuts.map((key, index) => (
                  <Kbd key={`${index}-${key}`}>{key}</Kbd>
                ))}
              </KbdGroup>
            )}
          </CardContent>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

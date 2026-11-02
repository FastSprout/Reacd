import { Activity, useId } from 'react';
import { Arrow } from '@radix-ui/react-hover-card';
import type { PopoverProps } from
  '@fastsprout/reacd/adapter-runtime/components/popover/popover.props.js';
import {
  POPOVER_DEFAULTS,
  POPOVER_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/popover-policy.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../vendor/ui/hover-card.js';
import { Button } from '../vendor/ui/button.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { useOverlayScope } from '../overlays/use-overlay-scope.js';
import { ShadcnPopoverBody } from './popover-body.js';
import { popoverSide } from './placement.js';

export function ShadcnHoverPopover(props: PopoverProps) {
  const { setHost, ...scope } = useOverlayScope(props);
  const id = useId();
  const retained = props.retainContent ?? POPOVER_DEFAULTS.retainContent;
  const dismissible = props.dismissible ?? POPOVER_DEFAULTS.dismissible;
  return (
    <HoverCard
      open={scope.visible}
      onOpenChange={scope.change}
      openDelay={
        POPOVER_POLICY.openDelay[props.openDelay ?? POPOVER_DEFAULTS.openDelay]
      }
      closeDelay={
        POPOVER_POLICY.closeDelay[props.closeDelay ?? POPOVER_DEFAULTS.closeDelay]
      }
    >
      <HoverCardTrigger asChild>
        <Button
          type="button"
          className={WRAPPING_BUTTON_CLASSES}
          disabled={scope.blocked}
          aria-haspopup="dialog"
          aria-expanded={scope.visible}
          aria-controls={scope.visible ? id : undefined}
        >
          {props.triggerLabel}
        </Button>
      </HoverCardTrigger>
      <Activity mode={retained && !scope.visible ? 'hidden' : 'visible'}>
        <HoverCardContent
          id={id}
          ref={setHost}
          container={scope.parentHost}
          forceMount={retained ? true : undefined}
          hidden={retained && !scope.visible}
          side={popoverSide(
            props.placement ?? POPOVER_DEFAULTS.placement,
            scope.direction,
          )}
          align={props.align ?? POPOVER_DEFAULTS.align}
          sideOffset={POPOVER_POLICY.sideOffsetPx}
          collisionPadding={POPOVER_POLICY.collisionPaddingPx}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${id}-title`}
          aria-describedby={props.description ? `${id}-description` : undefined}
          dir={scope.direction}
          onEscapeKeyDown={(event) => {
            if (!dismissible) event.preventDefault();
          }}
          onPointerDownOutside={(event) => {
            if (!dismissible) event.preventDefault();
          }}
          style={{
            ...scope.theme,
            overflowY: 'auto',
            overflowWrap: 'anywhere',
            maxInlineSize: 'var(--radix-hover-card-content-available-width)',
            maxBlockSize: 'var(--radix-hover-card-content-available-height)',
          }}
        >
          <ShadcnPopoverBody
            props={props}
            host={scope.host}
            visible={scope.visible}
            titleId={`${id}-title`}
            descriptionId={`${id}-description`}
            close={
              <Button
                type="button"
                variant="outline"
                className={WRAPPING_BUTTON_CLASSES}
                onClick={() => scope.change(false)}
              >
                {props.closeLabel ?? POPOVER_DEFAULTS.closeLabel}
              </Button>
            }
          />
          {(props.arrow ?? POPOVER_DEFAULTS.arrow) && (
            <Arrow className="fill-popover" />
          )}
        </HoverCardContent>
      </Activity>
    </HoverCard>
  );
}

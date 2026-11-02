import { Activity, useId } from 'react';
import { Arrow, Close } from '@radix-ui/react-popover';
import type { PopoverProps } from
  '@fastsprout/reacd/adapter-runtime/components/popover/popover.props.js';
import {
  POPOVER_DEFAULTS,
  POPOVER_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/popover-policy.js';
import { Popover, PopoverContent, PopoverTrigger } from '../vendor/ui/popover.js';
import { Button } from '../vendor/ui/button.js';
import { WRAPPING_BUTTON_CLASSES } from '../button/content-layout.js';
import { useOverlayScope } from '../overlays/use-overlay-scope.js';
import { ShadcnPopoverBody } from './popover-body.js';
import { popoverSide } from './placement.js';

export function ShadcnClickPopover(props: PopoverProps) {
  const { setHost, ...scope } = useOverlayScope(props);
  const id = useId();
  const retained = props.retainContent ?? POPOVER_DEFAULTS.retainContent;
  const dismissible = props.dismissible ?? POPOVER_DEFAULTS.dismissible;
  const modal = props.modal ?? POPOVER_DEFAULTS.modal;
  return (
    <Popover open={scope.visible} onOpenChange={scope.change} modal={modal}>
      <PopoverTrigger asChild>
        <Button type="button" disabled={scope.blocked}
          className={WRAPPING_BUTTON_CLASSES}>
          {props.triggerLabel}
        </Button>
      </PopoverTrigger>
      <Activity mode={retained && !scope.visible ? 'hidden' : 'visible'}>
        <PopoverContent
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
          aria-labelledby={`${id}-title`}
          aria-describedby={props.description ? `${id}-description` : undefined}
          aria-modal={modal}
          dir={scope.direction}
          onCloseAutoFocus={scope.closeAutoFocus}
          onEscapeKeyDown={(event) => {
            if (!dismissible) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (!dismissible) event.preventDefault();
          }}
          style={{
            ...scope.theme,
            overflowY: 'auto',
            overflowWrap: 'anywhere',
            maxInlineSize: 'var(--radix-popover-content-available-width)',
            maxBlockSize: 'var(--radix-popover-content-available-height)',
          }}
        >
          <ShadcnPopoverBody
            props={props}
            host={scope.host}
            visible={scope.visible}
            titleId={`${id}-title`}
            descriptionId={`${id}-description`}
            close={
              <Close asChild>
                <Button type="button" variant="outline"
                  className={WRAPPING_BUTTON_CLASSES}>
                  {props.closeLabel ?? POPOVER_DEFAULTS.closeLabel}
                </Button>
              </Close>
            }
          />
          {(props.arrow ?? POPOVER_DEFAULTS.arrow) && (
            <Arrow className="fill-popover" />
          )}
        </PopoverContent>
      </Activity>
    </Popover>
  );
}

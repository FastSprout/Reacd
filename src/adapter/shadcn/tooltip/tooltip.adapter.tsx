import { useContext, useState } from 'react';
import { Tooltip } from '@base-ui/react/tooltip';
import type { TooltipProps } from
  '@fastsprout/reacd/adapter-runtime/components/tooltip/tooltip.js';
import {
  TOOLTIP_DEFAULTS,
  TOOLTIP_DELAYS,
  TOOLTIP_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/tooltip-policy.js';
import { ThemeVariablesContext } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/theme-context.js';
import {
  PortalActiveContext,
  PortalHostContext,
} from '@fastsprout/reacd/adapter-runtime/renderer/theme/portal-context.js';
import { useTooltipAnchor } from './use-tooltip-anchor.js';
import { useEscapeLayer } from
  '@fastsprout/reacd/adapter-runtime/renderer/theme/use-escape-layer.js';
import { KbdKey } from '../kbd/kbd-key.adapter.js';

export function ShadcnTooltip({
  text,
  children,
  open,
  onOpenChange,
  disabled,
  shortcuts,
  placement = TOOLTIP_DEFAULTS.placement,
  delay = TOOLTIP_DEFAULTS.delay,
  arrow = TOOLTIP_DEFAULTS.arrow,
}: TooltipProps) {
  const variables = useContext(ThemeVariablesContext);
  const host = useContext(PortalHostContext);
  const active = useContext(PortalActiveContext);
  const [automaticOpen, setAutomaticOpen] = useState<boolean>(TOOLTIP_DEFAULTS.open);
  const actualOpen = open ?? automaticOpen;
  const shown = actualOpen && active && !disabled;
  function change(next: boolean) {
    setAutomaticOpen(next);
    onOpenChange?.(next);
  }
  useEscapeLayer(shown, () => change(false));
  const { ref: anchorRef, tabIndex } = useTooltipAnchor(children);
  return (
    <Tooltip.Root
      open={actualOpen}
      disabled={disabled || !active}
      onOpenChange={change}
    >
      <Tooltip.Trigger
        delay={TOOLTIP_DELAYS[delay]}
        render={<div ref={anchorRef} />}
        role="group"
        aria-label={text}
        tabIndex={disabled ? -1 : tabIndex}
        className="reacd-node reacd-tooltip-anchor"
        data-slot="tooltip-trigger"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && shown) {
            event.stopPropagation();
            change(false);
          }
        }}
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal container={host ?? undefined}>
        <Tooltip.Positioner
          side={placement}
          sideOffset={TOOLTIP_POLICY.sideOffsetPx}
          collisionPadding={TOOLTIP_POLICY.collisionPaddingPx}
          style={variables}
          className="reacd-root reacd-portal-root reacd-tooltip-positioner"
        >
          <Tooltip.Popup
            role="tooltip"
            className="reacd-tooltip-popup"
            data-slot="tooltip-content"
          >
            <div className="reacd-tooltip-body">
              <span>{text}</span>
              {shortcuts !== undefined && shortcuts.length > 0 && (
                <span className="reacd-tooltip-shortcuts">
                  {shortcuts.map((key, index) => (
                    <KbdKey key={index} display={key} label={key} />
                  ))}
                </span>
              )}
            </div>
            {arrow && <Tooltip.Arrow className="reacd-tooltip-arrow" />}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import type { TooltipProps } from
  '@fastsprout/reacd/adapter-runtime/components/tooltip/tooltip.props.js';
import {
  TOOLTIP_DEFAULTS,
  TOOLTIP_DELAYS,
  TOOLTIP_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/tooltip-policy.js';

import { useNativeField } from '../native-field.js';

export type MuiTooltipProps = TooltipProps;

export function MuiTooltip(props: MuiTooltipProps) {
  const theme = useTheme();
  const field = useNativeField(props);
  const change = field.blocked ? undefined : props.onOpenChange;
  const placement = props.placement ?? TOOLTIP_DEFAULTS.placement;
  const side =
    placement === 'inline-start'
      ? theme.direction === 'rtl'
        ? 'right'
        : 'left'
      : placement === 'inline-end'
        ? theme.direction === 'rtl'
          ? 'left'
          : 'right'
        : placement;
  const text = props.shortcuts?.length
    ? `${props.text} (${props.shortcuts.join(', ')})`
    : props.text;
  return (
    <Tooltip
      title={
        field.blocked ? (
          ''
        ) : (
          <Box
            data-reacd-tooltip-scroll
            sx={{
              overflowY: 'auto',
              overflowWrap: 'anywhere',
              maxHeight:
                `calc(100dvh - ${TOOLTIP_POLICY.collisionPaddingPx * 2}px - ` +
                `${TOOLTIP_POLICY.arrowRem * 2}rem)`,
            }}
          >
            {text}
          </Box>
        )
      }
      placement={side}
      describeChild
      slotProps={{
        tooltip: {
          sx: {
            maxWidth:
              `min(${TOOLTIP_POLICY.widthRem}rem, ` +
              `calc(100dvw - ${TOOLTIP_POLICY.collisionPaddingPx * 2}px))`,
            maxHeight: `calc(100dvh - ${TOOLTIP_POLICY.collisionPaddingPx * 2}px)`,
            overflowWrap: 'anywhere',
            whiteSpace: 'normal',
            overflowY: 'visible',
          },
        },
        popper: {
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                altAxis: true,
                tether: false,
                padding: TOOLTIP_POLICY.collisionPaddingPx,
              },
            },
          ],
        },
      }}
      arrow={props.arrow ?? TOOLTIP_DEFAULTS.arrow}
      enterDelay={TOOLTIP_DELAYS[props.delay ?? TOOLTIP_DEFAULTS.delay]}
      open={props.open}
      disableHoverListener={field.blocked}
      disableFocusListener={field.blocked}
      disableTouchListener={field.blocked}
      onOpen={change ? () => change(true) : undefined}
      onClose={change ? () => change(false) : undefined}
    >
      <Box component="span" sx={{ display: 'inline-flex', maxWidth: '100%' }}>
        {props.children}
      </Box>
    </Tooltip>
  );
}

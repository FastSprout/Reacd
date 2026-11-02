import { Children } from 'react';
import Divider from '@mui/material/Divider';
import type { SeparatorProps } from
  '@fastsprout/reacd/adapter-runtime/components/separator/separator.props.js';
import {
  SEPARATOR_DEFAULTS,
  SEPARATOR_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/shell-policy.js';

export type MuiSeparatorProps = SeparatorProps;
const widths = {
  small: SEPARATOR_POLICY.smallWidthPx,
  medium: SEPARATOR_POLICY.mediumWidthPx,
  large: SEPARATOR_POLICY.largeWidthPx,
};
const colors = { neutral: 'divider', primary: 'primary.main', danger: 'error.main' };
const alignment = { start: 'left', center: 'center', end: 'right' } as const;

export function MuiSeparator({
  label,
  children,
  orientation = SEPARATOR_DEFAULTS.orientation,
  position = SEPARATOR_DEFAULTS.position,
  lineStyle = SEPARATOR_DEFAULTS.lineStyle,
  intent = SEPARATOR_DEFAULTS.intent,
  size = SEPARATOR_DEFAULTS.size,
  decorative = SEPARATOR_DEFAULTS.decorative,
}: SeparatorProps) {
  const content = label ?? children;
  const labelled = Children.toArray(content).length > 0;
  const vertical = orientation === 'vertical';
  return (
    <Divider
      component="div"
      orientation={orientation}
      flexItem={vertical}
      role={decorative ? 'presentation' : 'separator'}
      aria-hidden={decorative ? true : undefined}
      aria-label={label}
      aria-orientation={orientation}
      textAlign={alignment[position]}
      sx={{
        minWidth: 0,
        maxWidth: '100%',
        borderColor: colors[intent],
        borderStyle: lineStyle,
        borderBottomWidth: !labelled && !vertical ? widths[size] : 0,
        borderRightWidth: !labelled && vertical ? widths[size] : 0,
        ...(vertical
          ? { minBlockSize: `${SEPARATOR_POLICY.verticalExtentRem}rem` }
          : {}),
        '&::before, &::after': {
          borderColor: colors[intent],
          borderTopStyle: lineStyle,
          borderLeftStyle: lineStyle,
          borderTopWidth: vertical ? 0 : widths[size],
          borderLeftWidth: vertical ? widths[size] : 0,
        },
        '& .MuiDivider-wrapper': {
          minWidth: 0,
          maxWidth: '100%',
          whiteSpace: 'normal',
          overflowWrap: 'anywhere',
        },
      }}
    >
      {content}
    </Divider>
  );
}

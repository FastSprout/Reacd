import { Children } from 'react';
import type { SeparatorProps } from
  '@fastsprout/reacd/adapter-runtime/components/separator/separator.props.js';
import {
  SEPARATOR_DEFAULTS,
  SEPARATOR_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/shell-policy.js';
import { Separator } from '../vendor/ui/separator.js';
import { CardContent } from '../vendor/ui/card.js';
import { FieldTitle } from '../vendor/ui/field.js';

export type ShadcnSeparatorProps = SeparatorProps;
const widths = {
  small: SEPARATOR_POLICY.smallWidthPx,
  medium: SEPARATOR_POLICY.mediumWidthPx,
  large: SEPARATOR_POLICY.largeWidthPx,
};
const colors = {
  neutral: 'var(--border)',
  primary: 'var(--primary)',
  danger: 'var(--destructive)',
};

export function ShadcnSeparator({
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
  const vertical = orientation === 'vertical';
  const line = {
    background: 'transparent',
    borderColor: colors[intent],
    borderStyle: lineStyle,
    borderWidth: 0,
    borderInlineStartWidth: vertical ? widths[size] : 0,
    borderBlockStartWidth: vertical ? 0 : widths[size],
    ...(vertical ? { minBlockSize: `${SEPARATOR_POLICY.verticalExtentRem}rem` } : {}),
  };
  if (Children.toArray(content).length === 0)
    return (
      <Separator
        orientation={orientation}
        decorative={decorative}
        aria-orientation={orientation}
        style={line}
      />
    );
  return (
    <CardContent
      role={decorative ? 'presentation' : 'separator'}
      aria-hidden={decorative ? true : undefined}
      aria-label={label}
      aria-orientation={orientation}
      className={
        `flex min-w-0 max-w-full items-center gap-2 p-0 ` + (vertical ? 'flex-col' : '')
      }
    >
      {position !== 'start' && (
        <Separator
          decorative
          orientation={orientation}
          className="min-w-0 flex-1"
          style={line}
        />
      )}
      <FieldTitle
        className={
          'min-w-0 max-w-full whitespace-normal [overflow-wrap:anywhere]'
        }
      >
        {content}
      </FieldTitle>
      {position !== 'end' && (
        <Separator
          decorative
          orientation={orientation}
          className="min-w-0 flex-1"
          style={line}
        />
      )}
    </CardContent>
  );
}

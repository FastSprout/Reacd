import type { ChipProps } from
  '@fastsprout/reacd/adapter-runtime/components/chip/chip.props.js';
import {
  CHIP_DEFAULTS,
  CHIP_POLICY,
} from '@fastsprout/reacd/adapter-runtime/core/chip-policy.js';
import { Badge } from '../vendor/ui/badge.js';
import { CardContent } from '../vendor/ui/card.js';

export type ShadcnChipProps = ChipProps;
const variants = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
} as const;

export function ShadcnChip({
  label,
  text,
  children,
  size = CHIP_DEFAULTS.size,
  intent = CHIP_DEFAULTS.intent,
  corner = CHIP_DEFAULTS.corner,
  inset = CHIP_DEFAULTS.inset,
  standalone = CHIP_DEFAULTS.standalone,
  show = CHIP_DEFAULTS.show,
}: ChipProps) {
  const name = text === undefined ? label : `${label}: ${text}`;
  const indicator = show && (
    <Badge
      role="img"
      aria-label={name}
      title={name}
      variant={variants[intent]}
      className="min-w-0 truncate"
      style={{
        fontSize: `${CHIP_POLICY.textScale[size]}em`,
        maxInlineSize: `${CHIP_POLICY.maxInlineRem}rem`,
        ...(text === undefined
          ? {
              padding: 0,
              inlineSize: `${CHIP_POLICY.dotRem[size]}rem`,
              blockSize: `${CHIP_POLICY.dotRem[size]}rem`,
            }
          : {}),
      }}
    >
      {text}
    </Badge>
  );
  if (standalone) return indicator;
  return (
    <CardContent
      className="grid min-w-0 max-w-full p-0"
      style={{ gap: inset ? 0 : `${CHIP_POLICY.clearanceRem}rem` }}
    >
      {!corner.startsWith('bottom') && (
        <CardContent
          className="flex p-0"
          style={{ justifyContent: corner.endsWith('start') ? 'start' : 'end' }}
        >
          {indicator}
        </CardContent>
      )}
      {children}
      {corner.startsWith('bottom') && (
        <CardContent
          className="flex p-0"
          style={{ justifyContent: corner.endsWith('start') ? 'start' : 'end' }}
        >
          {indicator}
        </CardContent>
      )}
    </CardContent>
  );
}

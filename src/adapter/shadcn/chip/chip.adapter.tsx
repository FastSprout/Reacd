import type { ChipProps } from '../../../components/chip/chip.js';
import { CHIP_DEFAULTS } from '../../../core/chip-policy.js';
import { Badge } from '../vendor/ui/badge.js';

const VARIANTS = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
} as const;
export function ShadcnChip({
  label,
  text,
  children,
  intent = CHIP_DEFAULTS.intent,
  size = CHIP_DEFAULTS.size,
  corner = CHIP_DEFAULTS.corner,
  inset = CHIP_DEFAULTS.inset,
  standalone = CHIP_DEFAULTS.standalone,
  show = CHIP_DEFAULTS.show,
}: ChipProps) {
  const identity = text === undefined ? label : `${label}: ${text}`;
  return (
    <div
      className="reacd-node reacd-chip"
      data-slot="chip"
      data-size={size}
      data-corner={corner}
      data-inset={inset}
      data-standalone={standalone}
    >
      {!standalone && <div className="reacd-chip-body">{children}</div>}
      {show && (
        <Badge
          className="reacd-chip-indicator"
          variant={VARIANTS[intent]}
          data-dot={text === undefined}
          data-intent={intent}
          role="img"
          aria-label={identity}
          title={identity}
        >
          {text !== undefined && <span className="reacd-chip-text">{text}</span>}
        </Badge>
      )}
    </div>
  );
}

import type { SeparatorProps } from
  '@fastsprout/reacd/adapter-runtime/components/separator/separator.js';
import { SEPARATOR_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/shell-policy.js';
import { Separator } from '../primitives/separator.js';

export function SharedSeparator({
  label,
  children,
  orientation = SEPARATOR_DEFAULTS.orientation,
  position = SEPARATOR_DEFAULTS.position,
  lineStyle = SEPARATOR_DEFAULTS.lineStyle,
  intent = SEPARATOR_DEFAULTS.intent,
  size = SEPARATOR_DEFAULTS.size,
  decorative = SEPARATOR_DEFAULTS.decorative,
}: SeparatorProps) {
  return (
    <Separator
      className="reacd-node reacd-separator"
      orientation={orientation}
      decorative={decorative}
      aria-hidden={decorative || undefined}
      aria-label={label}
      data-position={position}
      data-line-style={lineStyle}
      data-intent={intent}
      data-size={size}
    >
      <span className="reacd-separator-line" />
      {(label !== undefined || children !== undefined) && (
        <span className="reacd-separator-content">{label ?? children}</span>
      )}
      <span className="reacd-separator-line" />
    </Separator>
  );
}

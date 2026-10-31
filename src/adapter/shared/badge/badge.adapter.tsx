import type { BadgeProps } from
  '@fastsprout/reacd/adapter-runtime/components/badge/badge.js';
import { DEFAULTS } from '@fastsprout/reacd/adapter-runtime/core/policy.js';
import { Badge } from '../primitives/badge.js';
import { ELEMENT_POLICY } from
  '@fastsprout/reacd/adapter-runtime/core/element-policy.js';
import { SharedIcon } from '../icon/icon.adapter.js';
import { ELEMENT_BUTTON_VARIANTS } from '../element/variants.js';

export function SharedBadge({
  label,
  intent,
  leadingIcon,
  size = ELEMENT_POLICY.badgeSize,
}: BadgeProps) {
  return (
    <Badge
      className="reacd-node reacd-badge"
      variant={ELEMENT_BUTTON_VARIANTS[intent ?? DEFAULTS.badgeIntent]}
      data-size={size}
    >
      {leadingIcon === undefined ? null : (
        <SharedIcon name={leadingIcon} decorative size="small" />
      )}
      <span>{label}</span>
    </Badge>
  );
}

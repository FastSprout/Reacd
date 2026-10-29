import type { BadgeProps } from '../../../components/badge/badge.js';
import { DEFAULTS } from '../../../core/policy.js';
import { Badge } from '../vendor/ui/badge.js';
import { ELEMENT_POLICY } from '../../../core/element-policy.js';
import { ShadcnIcon } from '../icon/icon.adapter.js';
import { ELEMENT_BUTTON_VARIANTS } from '../element/variants.js';

export function ShadcnBadge({
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
        <ShadcnIcon name={leadingIcon} decorative size="small" />
      )}
      <span>{label}</span>
    </Badge>
  );
}

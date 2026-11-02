import type { BadgeProps } from
  '@fastsprout/reacd/adapter-runtime/components/badge/badge.props.js';
import { Badge } from '../vendor/ui/badge.js';
import { ShadcnIcon } from '../icon/icon.adapter.js';

export type ShadcnBadgeProps = BadgeProps;
const variants = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
} as const;
const sizes = { small: 'text-xs', medium: 'text-sm', large: 'text-base' };
export function ShadcnBadge({
  label,
  intent = 'secondary',
  leadingIcon,
  size = 'small',
}: BadgeProps) {
  return (
    <Badge variant={variants[intent]} className={`gap-1 ${sizes[size]}`}>
      {leadingIcon && <ShadcnIcon name={leadingIcon} decorative />}
      {label}
    </Badge>
  );
}

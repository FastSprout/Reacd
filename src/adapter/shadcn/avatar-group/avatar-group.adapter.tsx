import type { AvatarGroupProps } from
  '@fastsprout/reacd/adapter-runtime/components/avatar-group/avatar-group.props.js';
import { AVATAR_DEFAULTS } from
  '@fastsprout/reacd/adapter-runtime/core/avatar-policy.js';
import { AvatarGroup } from '../vendor/ui/avatar.js';
import { CardDescription } from '../vendor/ui/card.js';
import { ShadcnAvatarOverflow } from './overflow.js';
import { ShadcnAvatar } from '../avatar/avatar.adapter.js';

export type ShadcnAvatarGroupProps = AvatarGroupProps;
export function ShadcnAvatarGroup({
  label,
  items,
  size = AVATAR_DEFAULTS.size,
  max = AVATAR_DEFAULTS.max,
  emptyMessage = AVATAR_DEFAULTS.emptyMessage,
}: AvatarGroupProps) {
  const visible = items.slice(0, max);
  const remaining = items.length - visible.length;
  return (
    <AvatarGroup role="group" aria-label={label}
      className="min-w-0 max-w-full flex-wrap gap-2 space-x-0">
      {visible.map(({ id, ...identity }) => (
        <ShadcnAvatar key={id} {...identity} size={size} />
      ))}
      {remaining > 0 && <ShadcnAvatarOverflow items={items.slice(max)} size={size} />}
      {items.length === 0 && <CardDescription>{emptyMessage}</CardDescription>}
    </AvatarGroup>
  );
}

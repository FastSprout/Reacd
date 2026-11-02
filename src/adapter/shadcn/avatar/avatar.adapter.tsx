import type { AvatarProps } from
  '@fastsprout/reacd/adapter-runtime/components/avatar/avatar.props.js';
import {
  AVATAR_DEFAULTS,
  AVATAR_DIMENSIONS,
} from '@fastsprout/reacd/adapter-runtime/core/avatar-policy.js';
import { avatarInitials } from '@fastsprout/reacd/adapter-runtime/core/avatar-text.js';
import { Avatar, AvatarFallback, AvatarImage } from '../vendor/ui/avatar.js';

export type ShadcnAvatarProps = AvatarProps;
export function ShadcnAvatar({
  name,
  src,
  fallback,
  size = AVATAR_DEFAULTS.size,
}: AvatarProps) {
  const dimension = `${AVATAR_DIMENSIONS[size].rem}rem`;
  return (
    <Avatar
      role="img"
      aria-label={name}
      style={{ width: dimension, height: dimension }}
    >
      <AvatarImage src={src} alt="" />
      <AvatarFallback>{fallback ?? avatarInitials(name)}</AvatarFallback>
    </Avatar>
  );
}

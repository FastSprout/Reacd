import Avatar from '@mui/material/Avatar';
import type { AvatarProps } from
  '@fastsprout/reacd/adapter-runtime/components/avatar/avatar.props.js';
import {
  AVATAR_DEFAULTS,
  AVATAR_DIMENSIONS,
} from '@fastsprout/reacd/adapter-runtime/core/avatar-policy.js';
import { avatarInitials } from '@fastsprout/reacd/adapter-runtime/core/avatar-text.js';

export type MuiAvatarProps = AvatarProps;

export function MuiAvatar(props: MuiAvatarProps) {
  const dimension = AVATAR_DIMENSIONS[props.size ?? AVATAR_DEFAULTS.size].rem;
  return (
    <Avatar
      src={props.src}
      slotProps={{ img: { alt: '', 'aria-hidden': true } }}
      alt={props.name}
      role="img"
      aria-label={props.name}
      sx={{ width: `${dimension}rem`, height: `${dimension}rem` }}
    >
      {props.fallback ?? avatarInitials(props.name)}
    </Avatar>
  );
}

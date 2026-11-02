import type { ColorModeAvatarProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-avatar/index.js';
import { MuiAvatar } from '../avatar/avatar.adapter.js';

export type MuiColorModeAvatarProps = ColorModeAvatarProps;

export function MuiColorModeAvatar(props: MuiColorModeAvatarProps) {
  return (
    <MuiAvatar
      name={props.name}
      fallback={props.fallback}
      size={props.size}
      src={props.mode === 'dark' ? props.dark : props.light}
    />
  );
}

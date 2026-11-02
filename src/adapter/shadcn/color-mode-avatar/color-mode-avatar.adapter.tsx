import type { ColorModeAvatarProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-avatar/index.js';
import { ShadcnAvatar } from '../avatar/avatar.adapter.js';

export type ShadcnColorModeAvatarProps = ColorModeAvatarProps;
export function ShadcnColorModeAvatar({
  mode,
  light,
  dark,
  ...properties
}: ColorModeAvatarProps) {
  return <ShadcnAvatar {...properties} src={mode === 'dark' ? dark : light} />;
}

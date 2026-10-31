import type { ColorModeAvatarProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-avatar/index.js';
import { SharedAvatar } from '../avatar/avatar.adapter.js';

export function SharedColorModeAvatar({
  mode,
  light,
  dark,
  ...properties
}: ColorModeAvatarProps) {
  const source = mode === 'light' ? light : dark;
  return <SharedAvatar key={source} {...properties} src={source} />;
}

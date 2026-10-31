import type { ColorModeAvatarProps } from
  '@fastsprout/reacd/adapter-runtime/components/color-mode-avatar/index.js';
import { ShadcnAvatar } from '../avatar/avatar.adapter.js';

export function ShadcnColorModeAvatar({
  mode,
  light,
  dark,
  ...properties
}: ColorModeAvatarProps) {
  const source = mode === 'light' ? light : dark;
  return <ShadcnAvatar key={source} {...properties} src={source} />;
}

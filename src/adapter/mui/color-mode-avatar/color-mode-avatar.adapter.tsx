import type { ComponentProps, ComponentType } from 'react';
import { SharedColorModeAvatar } from
  '../../shared/color-mode-avatar/color-mode-avatar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiColorModeAvatarProps = ComponentProps<typeof SharedColorModeAvatar>;
export const MuiColorModeAvatar: ComponentType<MuiColorModeAvatarProps> =
  bindPrimitives(SharedColorModeAvatar, muiPrimitives, 'MuiColorModeAvatar');

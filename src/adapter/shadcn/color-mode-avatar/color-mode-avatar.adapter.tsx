import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/color-mode-avatar/color-mode-avatar.adapter.js';
import { SharedColorModeAvatar } from
  '../../shared/color-mode-avatar/color-mode-avatar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnColorModeAvatarProps = ComponentProps<typeof SharedColorModeAvatar>;
export const ShadcnColorModeAvatar: ComponentType<ShadcnColorModeAvatarProps> =
  bindPrimitives(SharedColorModeAvatar, shadcnPrimitives, 'ShadcnColorModeAvatar');

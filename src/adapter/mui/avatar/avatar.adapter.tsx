import type { ComponentProps, ComponentType } from 'react';
import { SharedAvatar } from '../../shared/avatar/avatar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiAvatarProps = ComponentProps<typeof SharedAvatar>;
export const MuiAvatar: ComponentType<MuiAvatarProps> = bindPrimitives(
  SharedAvatar,
  muiPrimitives,
  'MuiAvatar',
);

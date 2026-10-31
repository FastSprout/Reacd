import type { ComponentProps, ComponentType } from 'react';
import { SharedAvatarGroup } from '../../shared/avatar-group/avatar-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiAvatarGroupProps = ComponentProps<typeof SharedAvatarGroup>;
export const MuiAvatarGroup: ComponentType<MuiAvatarGroupProps> = bindPrimitives(
  SharedAvatarGroup,
  muiPrimitives,
  'MuiAvatarGroup',
);

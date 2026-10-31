import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/avatar-group/avatar-group.adapter.js';
import { SharedAvatarGroup } from '../../shared/avatar-group/avatar-group.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnAvatarGroupProps = ComponentProps<typeof SharedAvatarGroup>;
export const ShadcnAvatarGroup: ComponentType<ShadcnAvatarGroupProps> = bindPrimitives(
  SharedAvatarGroup,
  shadcnPrimitives,
  'ShadcnAvatarGroup',
);

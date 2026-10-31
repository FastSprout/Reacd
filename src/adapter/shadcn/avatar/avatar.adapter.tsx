import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/avatar/avatar.adapter.js';
import { SharedAvatar } from '../../shared/avatar/avatar.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnAvatarProps = ComponentProps<typeof SharedAvatar>;
export const ShadcnAvatar: ComponentType<ShadcnAvatarProps> = bindPrimitives(
  SharedAvatar,
  shadcnPrimitives,
  'ShadcnAvatar',
);

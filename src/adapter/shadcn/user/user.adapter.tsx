import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/user/user.adapter.js';
import { SharedUser } from '../../shared/user/user.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnUserProps = ComponentProps<typeof SharedUser>;
export const ShadcnUser: ComponentType<ShadcnUserProps> = bindPrimitives(
  SharedUser,
  shadcnPrimitives,
  'ShadcnUser',
);

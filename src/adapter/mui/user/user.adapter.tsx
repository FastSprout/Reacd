import type { ComponentProps, ComponentType } from 'react';
import { SharedUser } from '../../shared/user/user.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiUserProps = ComponentProps<typeof SharedUser>;
export const MuiUser: ComponentType<MuiUserProps> = bindPrimitives(
  SharedUser,
  muiPrimitives,
  'MuiUser',
);

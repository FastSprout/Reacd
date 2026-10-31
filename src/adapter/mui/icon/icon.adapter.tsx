import type { ComponentProps, ComponentType } from 'react';
import { SharedIcon } from '../../shared/icon/icon.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiIconProps = ComponentProps<typeof SharedIcon>;
export const MuiIcon: ComponentType<MuiIconProps> = bindPrimitives(
  SharedIcon,
  muiPrimitives,
  'MuiIcon',
);

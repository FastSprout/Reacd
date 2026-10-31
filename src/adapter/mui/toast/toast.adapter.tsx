import type { ComponentProps, ComponentType } from 'react';
import { SharedToast } from '../../shared/toast/toast.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiToastProps = ComponentProps<typeof SharedToast>;
export const MuiToast: ComponentType<MuiToastProps> = bindPrimitives(
  SharedToast,
  muiPrimitives,
  'MuiToast',
);

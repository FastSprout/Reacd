import type { ComponentProps, ComponentType } from 'react';
import { SharedAlert } from '../../shared/alert/alert.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiAlertProps = ComponentProps<typeof SharedAlert>;
export const MuiAlert: ComponentType<MuiAlertProps> = bindPrimitives(
  SharedAlert,
  muiPrimitives,
  'MuiAlert',
);

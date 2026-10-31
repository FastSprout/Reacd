import type { ComponentProps, ComponentType } from 'react';
import { SharedInputTime } from '../../shared/input-time/input-time.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiInputTimeProps = ComponentProps<typeof SharedInputTime>;
export const MuiInputTime: ComponentType<MuiInputTimeProps> = bindPrimitives(
  SharedInputTime,
  muiPrimitives,
  'MuiInputTime',
);

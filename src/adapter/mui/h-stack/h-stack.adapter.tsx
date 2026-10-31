import type { ComponentProps, ComponentType } from 'react';
import { SharedHStack } from '../../shared/h-stack/h-stack.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiHStackProps = ComponentProps<typeof SharedHStack>;
export const MuiHStack: ComponentType<MuiHStackProps> = bindPrimitives(
  SharedHStack,
  muiPrimitives,
  'MuiHStack',
);

import type { ComponentProps, ComponentType } from 'react';
import { SharedContainer } from '../../shared/container/container.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiContainerProps = ComponentProps<typeof SharedContainer>;
export const MuiContainer: ComponentType<MuiContainerProps> = bindPrimitives(
  SharedContainer,
  muiPrimitives,
  'MuiContainer',
);

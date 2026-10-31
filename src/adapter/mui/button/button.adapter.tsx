import type { ComponentProps, ComponentType } from 'react';
import { SharedButton } from '../../shared/button/button.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiButtonProps = ComponentProps<typeof SharedButton>;
export const MuiButton: ComponentType<MuiButtonProps> = bindPrimitives(
  SharedButton,
  muiPrimitives,
  'MuiButton',
);

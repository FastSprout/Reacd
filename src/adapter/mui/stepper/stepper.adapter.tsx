import type { ComponentProps, ComponentType } from 'react';
import { SharedStepper } from '../../shared/stepper/stepper.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiStepperProps = ComponentProps<typeof SharedStepper>;
export const MuiStepper: ComponentType<MuiStepperProps> = bindPrimitives(
  SharedStepper,
  muiPrimitives,
  'MuiStepper',
);

import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/stepper/stepper.adapter.js';
import { SharedStepper } from '../../shared/stepper/stepper.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnStepperProps = ComponentProps<typeof SharedStepper>;
export const ShadcnStepper: ComponentType<ShadcnStepperProps> = bindPrimitives(
  SharedStepper,
  shadcnPrimitives,
  'ShadcnStepper',
);

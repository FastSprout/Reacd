import type { ReactNode } from 'react';
import type { StepperProps } from './stepper.props.js';
import { stepperSchema } from '../../schema/stepper/stepper.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { StepperProps } from './stepper.props.js';
export function Stepper(props: StepperProps): ReactNode {
  return useDeclaration('Stepper', stepperSchema, props);
}

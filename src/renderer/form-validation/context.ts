import { createContext } from 'react';
import type { FormConstraint } from '../../core/form-constraint.js';

export interface FormValidationMetadata {
  readonly attempted: boolean;
  readonly register: (constraint: FormConstraint) => () => void;
}

export const FormValidationContext = createContext<FormValidationMetadata | null>(null);

import type { ReactNode } from 'react';
import type { SpinnerProps } from './spinner.props.js';
import { spinnerSchema } from '../../schema/spinner/spinner.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { SpinnerProps } from './spinner.props.js';
export function Spinner(props: SpinnerProps): ReactNode {
  return useDeclaration('Spinner', spinnerSchema, props);
}

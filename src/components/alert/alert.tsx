import type { ReactNode } from 'react';
import type { AlertProps } from './alert.props.js';
import { alertSchema } from '../../schema/alert/alert.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { AlertProps } from './alert.props.js';
export function Alert(props: AlertProps): ReactNode {
  return useDeclaration('Alert', alertSchema, props);
}

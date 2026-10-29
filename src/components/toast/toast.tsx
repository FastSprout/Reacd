import { toastSchema } from '../../schema/toast/toast.schema.js';
import type { ReactNode } from 'react';
import { useDeclaration } from '../shared/use-declaration.js';
import type { ToastProps } from './toast.props.js';
export type { ToastProps } from './toast.props.js';
export function Toast(props: ToastProps): ReactNode {
  return useDeclaration('Toast', toastSchema, props);
}

import type { ReactNode } from 'react';
import type { ModalProps } from './modal.props.js';
import { modalSchema } from '../../schema/modal/modal.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { ModalProps } from './modal.props.js';
export function Modal(props: ModalProps): ReactNode {
  return useDeclaration('Modal', modalSchema, props);
}

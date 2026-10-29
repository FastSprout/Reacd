import type { ReactNode } from 'react';
import type { ContainerProps } from './container.props.js';
import { containerSchema } from '../../schema/container/container.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ContainerProps } from './container.props.js';
export function Container(props: ContainerProps): ReactNode {
  return useDeclaration('Container', containerSchema, props);
}

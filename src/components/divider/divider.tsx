import type { ReactNode } from 'react';
import type { DividerProps } from './divider.props.js';
import { dividerSchema } from '../../schema/divider/divider.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { DividerProps } from './divider.props.js';
export function Divider(props: DividerProps): ReactNode {
  return useDeclaration('Divider', dividerSchema, props);
}

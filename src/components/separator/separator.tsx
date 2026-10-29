import type { ReactNode } from 'react';
import type { SeparatorProps } from './separator.props.js';
import { separatorSchema } from '../../schema/separator/separator.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { SeparatorProps } from './separator.props.js';
export function Separator(props: SeparatorProps): ReactNode {
  return useDeclaration('Separator', separatorSchema, props);
}

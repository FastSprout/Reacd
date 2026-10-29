import type { ReactNode } from 'react';
import type { TableProps } from './table.props.js';
import { tableDeclarationSchema } from '../../schema/table/table.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { TableProps } from './table.props.js';
export function Table(props: TableProps): ReactNode {
  return useDeclaration('Table', tableDeclarationSchema, props);
}

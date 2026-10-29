import type { ReactNode } from 'react';
import type { DataTableProps } from './data-table.props.js';
import { dataTableComponentSchema } from '../../schema/data-table/data-table.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { DataTableProps } from './data-table.props.js';
export function DataTable(props: DataTableProps): ReactNode {
  return useDeclaration('DataTable', dataTableComponentSchema, props);
}

import type { ReactNode } from 'react';
import type { PaginationProps } from './pagination.props.js';
import { paginationSchema } from '../../schema/pagination/pagination.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { PaginationProps } from './pagination.props.js';
export function Pagination(props: PaginationProps): ReactNode {
  return useDeclaration('Pagination', paginationSchema, props);
}

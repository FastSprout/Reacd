import type { ReactNode } from 'react';
import type { PageListProps } from './page-list.props.js';
import { pageListSchema } from '../../schema/page-list/page-list.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageListProps } from './page-list.props.js';
export function PageList(props: PageListProps): ReactNode {
  return useDeclaration('PageList', pageListSchema, props);
}

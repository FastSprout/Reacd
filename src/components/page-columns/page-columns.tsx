import type { ReactNode } from 'react';
import type { PageColumnsProps } from './page-columns.props.js';
import { pageColumnsSchema } from '../../schema/page-columns/page-columns.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageColumnsProps } from './page-columns.props.js';
export function PageColumns(props: PageColumnsProps): ReactNode {
  return useDeclaration('PageColumns', pageColumnsSchema, props);
}

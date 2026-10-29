import type { ReactNode } from 'react';
import type { PageGridProps } from './page-grid.props.js';
import { pageGridSchema } from '../../schema/page-grid/page-grid.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageGridProps } from './page-grid.props.js';
export function PageGrid(props: PageGridProps): ReactNode {
  return useDeclaration('PageGrid', pageGridSchema, props);
}

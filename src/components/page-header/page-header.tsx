import type { ReactNode } from 'react';
import type { PageHeaderProps } from './page-header.props.js';
import { pageHeaderSchema } from '../../schema/page-header/page-header.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageHeaderProps } from './page-header.props.js';
export function PageHeader(props: PageHeaderProps): ReactNode {
  return useDeclaration('PageHeader', pageHeaderSchema, props);
}

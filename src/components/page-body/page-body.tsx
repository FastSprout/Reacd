import type { ReactNode } from 'react';
import type { PageBodyProps } from './page-body.props.js';
import { pageBodySchema } from '../../schema/page-body/page-body.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageBodyProps } from './page-body.props.js';
export function PageBody(props: PageBodyProps): ReactNode {
  return useDeclaration('PageBody', pageBodySchema, props);
}

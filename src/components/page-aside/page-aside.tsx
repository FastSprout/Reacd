import type { ReactNode } from 'react';
import type { PageAsideProps } from './page-aside.props.js';
import { pageAsideSchema } from '../../schema/page-aside/page-aside.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageAsideProps } from './page-aside.props.js';
export function PageAside(props: PageAsideProps): ReactNode {
  return useDeclaration('PageAside', pageAsideSchema, props);
}

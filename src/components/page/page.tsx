import type { ReactNode } from 'react';
import type { PageProps } from './page.props.js';
import { pageSchema } from '../../schema/page/page.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageProps } from './page.props.js';
export function Page(props: PageProps): ReactNode {
  return useDeclaration('Page', pageSchema, props);
}

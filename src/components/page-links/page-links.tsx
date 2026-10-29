import type { ReactNode } from 'react';
import type { PageLinksProps } from './page-links.props.js';
import { pageLinksSchema } from '../../schema/page-links/page-links.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageLinksProps } from './page-links.props.js';
export function PageLinks(props: PageLinksProps): ReactNode {
  return useDeclaration('PageLinks', pageLinksSchema, props);
}

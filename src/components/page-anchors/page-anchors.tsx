import type { ReactNode } from 'react';
import type { PageAnchorsProps } from './page-anchors.props.js';
import { pageAnchorsSchema } from '../../schema/page-anchors/page-anchors.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageAnchorsProps } from './page-anchors.props.js';
export function PageAnchors(props: PageAnchorsProps): ReactNode {
  return useDeclaration('PageAnchors', pageAnchorsSchema, props);
}

import type { ReactNode } from 'react';
import type { PageCardProps } from './page-card.props.js';
import { pageCardSchema } from '../../schema/page-card/page-card.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageCardProps } from './page-card.props.js';
export function PageCard(props: PageCardProps): ReactNode {
  return useDeclaration('PageCard', pageCardSchema, props);
}

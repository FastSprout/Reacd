import type { ReactNode } from 'react';
import type { PageCTAProps } from './page-cta.props.js';
import { pageCTASchema } from '../../schema/page-cta/page-cta.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageCTAProps } from './page-cta.props.js';
export function PageCTA(props: PageCTAProps): ReactNode {
  return useDeclaration('PageCTA', pageCTASchema, props);
}

import type { ReactNode } from 'react';
import type { PageSectionProps } from './page-section.props.js';
import { pageSectionSchema } from '../../schema/page-section/page-section.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageSectionProps } from './page-section.props.js';
export function PageSection(props: PageSectionProps): ReactNode {
  return useDeclaration('PageSection', pageSectionSchema, props);
}

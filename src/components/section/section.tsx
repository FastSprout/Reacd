import type { ReactNode } from 'react';
import type { SectionProps } from './section.props.js';
import { sectionSchema } from '../../schema/section/section.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { SectionProps } from './section.props.js';
export function Section(props: SectionProps): ReactNode {
  return useDeclaration('Section', sectionSchema, props);
}

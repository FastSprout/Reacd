import type { ReactNode } from 'react';
import type { BreadcrumbProps } from './breadcrumb.props.js';
import { breadcrumbSchema } from '../../schema/breadcrumb/breadcrumb.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { BreadcrumbProps } from './breadcrumb.props.js';
export function Breadcrumb(props: BreadcrumbProps): ReactNode {
  return useDeclaration('Breadcrumb', breadcrumbSchema, props);
}

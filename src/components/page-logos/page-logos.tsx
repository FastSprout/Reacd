import type { ReactNode } from 'react';
import type { PageLogosProps } from './page-logos.props.js';
import { pageLogosSchema } from '../../schema/page-logos/page-logos.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageLogosProps } from './page-logos.props.js';
export function PageLogos(props: PageLogosProps): ReactNode {
  return useDeclaration('PageLogos', pageLogosSchema, props);
}

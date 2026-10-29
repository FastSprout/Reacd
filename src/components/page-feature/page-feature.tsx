import type { ReactNode } from 'react';
import type { PageFeatureProps } from './page-feature.props.js';
import { pageFeatureSchema } from '../../schema/page-feature/page-feature.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PageFeatureProps } from './page-feature.props.js';
export function PageFeature(props: PageFeatureProps): ReactNode {
  return useDeclaration('PageFeature', pageFeatureSchema, props);
}

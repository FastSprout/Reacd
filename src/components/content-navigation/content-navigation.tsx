import type { ReactNode } from 'react';
import { contentNavigationSchema } from '../../schema/content-navigation/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
import type { ContentNavigationProps } from './content-navigation.props.js';

export function ContentNavigation(props: ContentNavigationProps): ReactNode {
  return useDeclaration('ContentNavigation', contentNavigationSchema, props);
}

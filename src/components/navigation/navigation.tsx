import type { ReactNode } from 'react';
import type { NavigationProps } from './navigation.props.js';
import { navigationSchema } from '../../schema/navigation/navigation.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { NavigationProps } from './navigation.props.js';
export function Navigation(props: NavigationProps): ReactNode {
  return useDeclaration('Navigation', navigationSchema, props);
}

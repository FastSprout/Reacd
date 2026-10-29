import type { ReactNode } from 'react';
import type { NavigationMenuProps } from './navigation-menu.props.js';
import {
  navigationMenuSchema,
} from '../../schema/navigation-menu/navigation-menu.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { NavigationMenuProps } from './navigation-menu.props.js';
export function NavigationMenu(props: NavigationMenuProps): ReactNode {
  return useDeclaration('NavigationMenu', navigationMenuSchema, props);
}

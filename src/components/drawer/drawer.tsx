import type { ReactNode } from 'react';
import type { DrawerProps } from './drawer.props.js';
import { drawerSchema } from '../../schema/drawer/drawer.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { DrawerProps } from './drawer.props.js';
export function Drawer(props: DrawerProps): ReactNode {
  return useDeclaration('Drawer', drawerSchema, props);
}

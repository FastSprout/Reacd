import type { ReactNode } from 'react';
import type { SidebarProps } from './sidebar.props.js';
import { sidebarSchema } from '../../schema/sidebar/sidebar.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function Sidebar(props: SidebarProps): ReactNode {
  return useDeclaration('Sidebar', sidebarSchema, props);
}

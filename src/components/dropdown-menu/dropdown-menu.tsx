import type { ReactNode } from 'react';
import type { DropdownMenuProps } from './dropdown-menu.props.js';
import { dropdownMenuSchema } from '../../schema/dropdown-menu/dropdown-menu.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { DropdownMenuProps } from './dropdown-menu.props.js';
export function DropdownMenu(props: DropdownMenuProps): ReactNode {
  return useDeclaration('DropdownMenu', dropdownMenuSchema, props);
}

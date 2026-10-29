import type { ReactNode } from 'react';
import { selectMenuSchema } from '../../schema/select-menu/index.js';
import type { SelectMenuProps } from './select-menu.props.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function SelectMenu(properties: SelectMenuProps): ReactNode {
  return useDeclaration('SelectMenu', selectMenuSchema, properties);
}

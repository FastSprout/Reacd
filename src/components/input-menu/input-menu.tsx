import type { ReactNode } from 'react';
import { inputMenuSchema } from '../../schema/input-menu/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
import type { InputMenuProps } from './input-menu.props.js';

export function InputMenu(properties: InputMenuProps): ReactNode {
  return useDeclaration('InputMenu', inputMenuSchema, properties);
}

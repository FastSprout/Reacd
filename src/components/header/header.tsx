import type { ReactNode } from 'react';
import type { HeaderProps } from './header.props.js';
import { headerSchema } from '../../schema/header/header.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { HeaderProps } from './header.props.js';
export function Header(props: HeaderProps): ReactNode {
  return useDeclaration('Header', headerSchema, props);
}

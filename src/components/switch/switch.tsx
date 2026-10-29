import type { ReactNode } from 'react';
import type { SwitchProps } from './switch.props.js';
import { switchSchema } from '../../schema/switch/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export function Switch(props: SwitchProps): ReactNode {
  return useDeclaration('Switch', switchSchema, props);
}

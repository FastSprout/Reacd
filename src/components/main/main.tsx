import type { ReactNode } from 'react';
import type { MainProps } from './main.props.js';
import { mainSchema } from '../../schema/main/main.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { MainProps } from './main.props.js';
export function Main(props: MainProps): ReactNode {
  return useDeclaration('Main', mainSchema, props);
}

import type { ReactNode } from 'react';
import type { ToolbarProps } from './toolbar.props.js';
import { toolbarSchema } from '../../schema/toolbar/toolbar.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ToolbarProps } from './toolbar.props.js';
export function Toolbar(props: ToolbarProps): ReactNode {
  return useDeclaration('Toolbar', toolbarSchema, props);
}

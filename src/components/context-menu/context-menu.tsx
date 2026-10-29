import type { ReactNode } from 'react';
import type { ContextMenuProps } from './context-menu.props.js';
import { contextMenuSchema } from '../../schema/context-menu/context-menu.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { ContextMenuProps } from './context-menu.props.js';
export function ContextMenu(props: ContextMenuProps): ReactNode {
  return useDeclaration('ContextMenu', contextMenuSchema, props);
}

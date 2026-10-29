import type { ReactNode } from 'react';
import type { TreeProps } from './tree.props.js';
import { treeSchema } from '../../schema/tree/tree.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { TreeProps } from './tree.props.js';
export function Tree(props: TreeProps): ReactNode {
  return useDeclaration('Tree', treeSchema, props);
}

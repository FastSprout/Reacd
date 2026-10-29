import type { ReactNode } from 'react';
import type { SplitViewProps } from './split-view.props.js';
import { splitViewSchema } from '../../schema/split-view/split-view.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { SplitViewProps } from './split-view.props.js';
export function SplitView(props: SplitViewProps): ReactNode {
  return useDeclaration('SplitView', splitViewSchema, props);
}

import type { ReactNode } from 'react';
import type { ScrollAreaProps } from './scroll-area.props.js';
import { scrollAreaSchema } from '../../schema/scroll-area/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { ScrollAreaProps } from './scroll-area.props.js';
export function ScrollArea(props: ScrollAreaProps): ReactNode {
  return useDeclaration('ScrollArea', scrollAreaSchema, props);
}

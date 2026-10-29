import type { ReactNode } from 'react';
import type { GridProps } from './grid.props.js';
import { gridSchema } from '../../schema/grid/grid.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { GridProps } from './grid.props.js';
export function Grid(props: GridProps): ReactNode {
  return useDeclaration('Grid', gridSchema, props);
}

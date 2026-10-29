import type { ReactNode } from 'react';
import type { ProgressProps } from './progress.props.js';
import { progressSchema } from '../../schema/progress/progress.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ProgressProps } from './progress.props.js';
export function Progress(props: ProgressProps): ReactNode {
  return useDeclaration('Progress', progressSchema, props);
}

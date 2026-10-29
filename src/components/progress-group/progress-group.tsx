import type { ReactNode } from 'react';
import type { ProgressGroupProps } from './progress-group.props.js';
import { progressGroupSchema } from '../../schema/progress-group/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { ProgressGroupProps } from './progress-group.props.js';
export function ProgressGroup(props: ProgressGroupProps): ReactNode {
  return useDeclaration('ProgressGroup', progressGroupSchema, props);
}

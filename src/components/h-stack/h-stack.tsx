import type { ReactNode } from 'react';
import type { HStackProps } from './h-stack.props.js';
import { hStackSchema } from '../../schema/h-stack/h-stack.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { HStackProps } from './h-stack.props.js';
export function HStack(props: HStackProps): ReactNode {
  return useDeclaration('HStack', hStackSchema, props);
}

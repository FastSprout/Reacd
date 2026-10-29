import type { ReactNode } from 'react';
import type { VStackProps } from './v-stack.props.js';
import { vStackSchema } from '../../schema/v-stack/v-stack.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { VStackProps } from './v-stack.props.js';
export function VStack(props: VStackProps): ReactNode {
  return useDeclaration('VStack', vStackSchema, props);
}

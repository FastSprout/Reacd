import type { ReactNode } from 'react';
import type { EmptyProps } from './empty.props.js';
import { emptySchema } from '../../schema/empty/empty.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { EmptyProps } from './empty.props.js';
export function Empty(props: EmptyProps): ReactNode {
  return useDeclaration('Empty', emptySchema, props);
}

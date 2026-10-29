import type { ReactNode } from 'react';
import type { ErrorProps } from './error.props.js';
import { errorSchema } from '../../schema/error/error.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ErrorProps } from './error.props.js';
export function Error(props: ErrorProps): ReactNode {
  return useDeclaration('Error', errorSchema, props);
}

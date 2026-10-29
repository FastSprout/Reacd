import type { ReactNode } from 'react';
import type { SpacerProps } from './spacer.props.js';
import { spacerSchema } from '../../schema/spacer/spacer.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { SpacerProps } from './spacer.props.js';
export function Spacer(props: SpacerProps): ReactNode {
  return useDeclaration('Spacer', spacerSchema, props);
}

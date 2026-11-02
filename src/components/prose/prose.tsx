import type { ReactNode } from 'react';
import { proseSchema } from '../../schema/prose/prose.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
import type { ProseProps } from './prose.props.js';

export type { ProseProps } from './prose.props.js';
export function Prose(props: ProseProps): ReactNode {
  return useDeclaration('Prose', proseSchema, props);
}

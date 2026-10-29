import type { ReactNode } from 'react';
import type { CollapsibleProps } from './collapsible.props.js';
import { collapsibleSchema } from '../../schema/collapsible/collapsible.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { CollapsibleProps } from './collapsible.props.js';
export function Collapsible(props: CollapsibleProps): ReactNode {
  return useDeclaration('Collapsible', collapsibleSchema, props);
}

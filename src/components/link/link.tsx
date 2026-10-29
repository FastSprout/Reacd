import type { ReactNode } from 'react';
import type { LinkProps } from './link.props.js';
import { linkSchema } from '../../schema/link/link.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { LinkProps } from './link.props.js';
export function Link(props: LinkProps): ReactNode {
  return useDeclaration('Link', linkSchema, props);
}

import type { ReactNode } from 'react';
import type { ViewportProps } from './viewport.props.js';
import { viewportSchema } from '../../schema/viewport/viewport.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ViewportProps } from './viewport.props.js';
export function Viewport(props: ViewportProps): ReactNode {
  return useDeclaration('Viewport', viewportSchema, props);
}

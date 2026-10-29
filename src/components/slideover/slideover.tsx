import type { ReactNode } from 'react';
import type { SlideoverProps } from './slideover.props.js';
import { slideoverSchema } from '../../schema/slideover/slideover.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { SlideoverProps } from './slideover.props.js';
export function Slideover(props: SlideoverProps): ReactNode {
  return useDeclaration('Slideover', slideoverSchema, props);
}

import type { ReactNode } from 'react';
import type { ToggleProps } from './toggle.props.js';
import { toggleSchema } from '../../schema/toggle/toggle.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ToggleProps } from './toggle.props.js';
export function Toggle(props: ToggleProps): ReactNode {
  return useDeclaration('Toggle', toggleSchema, props);
}

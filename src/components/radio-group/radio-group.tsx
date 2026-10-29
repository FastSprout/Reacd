import type { ReactNode } from 'react';
import type { RadioGroupProps } from './radio-group.props.js';
import { radioGroupSchema } from '../../schema/radio-group/radio-group.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { RadioGroupProps } from './radio-group.props.js';
export function RadioGroup(props: RadioGroupProps): ReactNode {
  return useDeclaration('RadioGroup', radioGroupSchema, props);
}

import type { ReactNode } from 'react';
import type { PinInputProps } from './pin-input.props.js';
import { pinInputSchema } from '../../schema/pin-input/pin-input.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { PinInputProps } from './pin-input.props.js';
export function PinInput(props: PinInputProps): ReactNode {
  return useDeclaration('PinInput', pinInputSchema, props);
}

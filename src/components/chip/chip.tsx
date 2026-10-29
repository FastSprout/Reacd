import type { ReactNode } from 'react';
import type { ChipProps } from './chip.props.js';
import { chipSchema } from '../../schema/chip/chip.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { ChipProps } from './chip.props.js';
export function Chip(props: ChipProps): ReactNode {
  return useDeclaration('Chip', chipSchema, props);
}

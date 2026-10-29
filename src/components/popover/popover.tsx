import type { ReactNode } from 'react';
import type { PopoverProps } from './popover.props.js';
import { popoverSchema } from '../../schema/popover/popover.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { PopoverProps } from './popover.props.js';
export function Popover(props: PopoverProps): ReactNode {
  return useDeclaration('Popover', popoverSchema, props);
}

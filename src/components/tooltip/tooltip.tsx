import type { ReactNode } from 'react';
import type { TooltipProps } from './tooltip.props.js';
import { tooltipSchema } from '../../schema/tooltip/tooltip.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { TooltipProps } from './tooltip.props.js';
export function Tooltip(props: TooltipProps): ReactNode {
  return useDeclaration('Tooltip', tooltipSchema, props);
}

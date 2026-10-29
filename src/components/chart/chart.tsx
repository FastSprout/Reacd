import type { ReactNode } from 'react';
import type { ChartProps } from './chart.props.js';
import { chartSchema } from '../../schema/chart/index.js';
import { useDeclaration } from '../shared/use-declaration.js';
export function Chart(props: ChartProps): ReactNode {
  return useDeclaration('Chart', chartSchema, props);
}

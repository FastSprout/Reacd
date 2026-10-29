import type { ReactNode } from 'react';
import type { TimelineProps } from './timeline.props.js';
import { timelineSchema } from '../../schema/timeline/timeline.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';
export type { TimelineProps } from './timeline.props.js';
export function Timeline(props: TimelineProps): ReactNode {
  return useDeclaration('Timeline', timelineSchema, props);
}

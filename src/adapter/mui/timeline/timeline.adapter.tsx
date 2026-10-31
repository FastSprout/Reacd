import type { ComponentProps, ComponentType } from 'react';
import { SharedTimeline } from '../../shared/timeline/timeline.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiTimelineProps = ComponentProps<typeof SharedTimeline>;
export const MuiTimeline: ComponentType<MuiTimelineProps> = bindPrimitives(
  SharedTimeline,
  muiPrimitives,
  'MuiTimeline',
);

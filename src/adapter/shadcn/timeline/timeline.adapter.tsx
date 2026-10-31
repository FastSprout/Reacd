import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/timeline/timeline.adapter.js';
import { SharedTimeline } from '../../shared/timeline/timeline.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnTimelineProps = ComponentProps<typeof SharedTimeline>;
export const ShadcnTimeline: ComponentType<ShadcnTimelineProps> = bindPrimitives(
  SharedTimeline,
  shadcnPrimitives,
  'ShadcnTimeline',
);

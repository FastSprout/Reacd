import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-anchors/page-anchors.adapter.js';
import { SharedPageAnchors } from '../../shared/page-anchors/page-anchors.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageAnchorsProps = ComponentProps<typeof SharedPageAnchors>;
export const ShadcnPageAnchors: ComponentType<ShadcnPageAnchorsProps> = bindPrimitives(
  SharedPageAnchors,
  shadcnPrimitives,
  'ShadcnPageAnchors',
);

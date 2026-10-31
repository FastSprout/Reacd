import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-body/page-body.adapter.js';
import { SharedPageBody } from '../../shared/page-body/page-body.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageBodyProps = ComponentProps<typeof SharedPageBody>;
export const ShadcnPageBody: ComponentType<ShadcnPageBodyProps> = bindPrimitives(
  SharedPageBody,
  shadcnPrimitives,
  'ShadcnPageBody',
);

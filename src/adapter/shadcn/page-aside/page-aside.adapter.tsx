import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-aside/page-aside.adapter.js';
import { SharedPageAside } from '../../shared/page-aside/page-aside.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageAsideProps = ComponentProps<typeof SharedPageAside>;
export const ShadcnPageAside: ComponentType<ShadcnPageAsideProps> = bindPrimitives(
  SharedPageAside,
  shadcnPrimitives,
  'ShadcnPageAside',
);

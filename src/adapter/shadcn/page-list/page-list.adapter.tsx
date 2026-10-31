import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/page-list/page-list.adapter.js';
import { SharedPageList } from '../../shared/page-list/page-list.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnPageListProps = ComponentProps<typeof SharedPageList>;
export const ShadcnPageList: ComponentType<ShadcnPageListProps> = bindPrimitives(
  SharedPageList,
  shadcnPrimitives,
  'ShadcnPageList',
);

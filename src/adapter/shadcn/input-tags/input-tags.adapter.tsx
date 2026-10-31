import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/input-tags/input-tags.adapter.js';
import { SharedInputTags } from '../../shared/input-tags/input-tags.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnInputTagsProps = ComponentProps<typeof SharedInputTags>;
export const ShadcnInputTags: ComponentType<ShadcnInputTagsProps> = bindPrimitives(
  SharedInputTags,
  shadcnPrimitives,
  'ShadcnInputTags',
);

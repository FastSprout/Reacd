import type { ComponentProps, ComponentType } from 'react';
import { SharedInputTags } from '../../shared/input-tags/input-tags.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiInputTagsProps = ComponentProps<typeof SharedInputTags>;
export const MuiInputTags: ComponentType<MuiInputTagsProps> = bindPrimitives(
  SharedInputTags,
  muiPrimitives,
  'MuiInputTags',
);

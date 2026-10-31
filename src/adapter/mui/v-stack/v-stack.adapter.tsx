import type { ComponentProps, ComponentType } from 'react';
import { SharedVStack } from '../../shared/v-stack/v-stack.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiVStackProps = ComponentProps<typeof SharedVStack>;
export const MuiVStack: ComponentType<MuiVStackProps> = bindPrimitives(
  SharedVStack,
  muiPrimitives,
  'MuiVStack',
);

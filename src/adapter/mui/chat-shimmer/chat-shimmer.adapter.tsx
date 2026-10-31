import type { ComponentProps, ComponentType } from 'react';
import { SharedChatShimmer } from '../../shared/chat-shimmer/chat-shimmer.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChatShimmerProps = ComponentProps<typeof SharedChatShimmer>;
export const MuiChatShimmer: ComponentType<MuiChatShimmerProps> = bindPrimitives(
  SharedChatShimmer,
  muiPrimitives,
  'MuiChatShimmer',
);

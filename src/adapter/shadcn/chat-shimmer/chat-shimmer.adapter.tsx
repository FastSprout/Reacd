import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chat-shimmer/chat-shimmer.adapter.js';
import { SharedChatShimmer } from '../../shared/chat-shimmer/chat-shimmer.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChatShimmerProps = ComponentProps<typeof SharedChatShimmer>;
export const ShadcnChatShimmer: ComponentType<ShadcnChatShimmerProps> = bindPrimitives(
  SharedChatShimmer,
  shadcnPrimitives,
  'ShadcnChatShimmer',
);

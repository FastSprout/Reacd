import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chat-message/chat-message.adapter.js';
import { SharedChatMessage } from '../../shared/chat-message/chat-message.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChatMessageProps = ComponentProps<typeof SharedChatMessage>;
export const ShadcnChatMessage: ComponentType<ShadcnChatMessageProps> = bindPrimitives(
  SharedChatMessage,
  shadcnPrimitives,
  'ShadcnChatMessage',
);

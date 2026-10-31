import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chat-messages/chat-messages.adapter.js';
import { SharedChatMessages } from
  '../../shared/chat-messages/chat-messages.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChatMessagesProps = ComponentProps<typeof SharedChatMessages>;
export const ShadcnChatMessages: ComponentType<ShadcnChatMessagesProps> =
  bindPrimitives(SharedChatMessages, shadcnPrimitives, 'ShadcnChatMessages');

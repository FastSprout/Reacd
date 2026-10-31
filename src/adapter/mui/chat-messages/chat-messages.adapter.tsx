import type { ComponentProps, ComponentType } from 'react';
import { SharedChatMessages } from
  '../../shared/chat-messages/chat-messages.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChatMessagesProps = ComponentProps<typeof SharedChatMessages>;
export const MuiChatMessages: ComponentType<MuiChatMessagesProps> = bindPrimitives(
  SharedChatMessages,
  muiPrimitives,
  'MuiChatMessages',
);

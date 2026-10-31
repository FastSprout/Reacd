import type { ComponentProps, ComponentType } from 'react';
import { SharedChatMessage } from '../../shared/chat-message/chat-message.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChatMessageProps = ComponentProps<typeof SharedChatMessage>;
export const MuiChatMessage: ComponentType<MuiChatMessageProps> = bindPrimitives(
  SharedChatMessage,
  muiPrimitives,
  'MuiChatMessage',
);

import type { ReactNode } from 'react';
import type { ChatMessageProps } from './chat-message.props.js';
import { chatMessageSchema } from '../../schema/chat-message/chat-message.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChatMessageProps } from './chat-message.props.js';
export function ChatMessage(props: ChatMessageProps): ReactNode {
  return useDeclaration('ChatMessage', chatMessageSchema, props);
}

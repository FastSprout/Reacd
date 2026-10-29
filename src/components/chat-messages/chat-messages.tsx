import type { ReactNode } from 'react';
import type { ChatMessagesProps } from './chat-messages.props.js';
import { chatMessagesSchema } from '../../schema/chat-messages/chat-messages.schema.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChatMessagesProps } from './chat-messages.props.js';
export function ChatMessages(props: ChatMessagesProps): ReactNode {
  return useDeclaration('ChatMessages', chatMessagesSchema, props);
}

import type { ReactNode } from 'react';
import type { ChatReasoningProps } from './chat-reasoning.props.js';
import { chatReasoningSchema } from '../../schema/chat-reasoning/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChatReasoningProps } from './chat-reasoning.props.js';
export function ChatReasoning(props: ChatReasoningProps): ReactNode {
  return useDeclaration('ChatReasoning', chatReasoningSchema, props);
}

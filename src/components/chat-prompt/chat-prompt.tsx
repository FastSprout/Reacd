import type { ReactNode } from 'react';
import type { ChatPromptProps } from './chat-prompt.props.js';
import { chatPromptSchema } from '../../schema/chat-prompt/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChatPromptProps } from './chat-prompt.props.js';
export function ChatPrompt(props: ChatPromptProps): ReactNode {
  return useDeclaration('ChatPrompt', chatPromptSchema, props);
}

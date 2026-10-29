import type { ReactNode } from 'react';
import type { ChatPromptSubmitProps } from './chat-prompt-submit.props.js';
import { chatPromptSubmitSchema } from '../../schema/chat-prompt-submit/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChatPromptSubmitProps } from './chat-prompt-submit.props.js';
export function ChatPromptSubmit(props: ChatPromptSubmitProps): ReactNode {
  return useDeclaration('ChatPromptSubmit', chatPromptSubmitSchema, props);
}

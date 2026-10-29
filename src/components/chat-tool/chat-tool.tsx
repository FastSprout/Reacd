import type { ReactNode } from 'react';
import type { ChatToolProps } from './chat-tool.props.js';
import { chatToolSchema } from '../../schema/chat-tool/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChatToolProps } from './chat-tool.props.js';
export function ChatTool(props: ChatToolProps): ReactNode {
  return useDeclaration('ChatTool', chatToolSchema, props);
}

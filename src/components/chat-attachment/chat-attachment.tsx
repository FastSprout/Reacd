import type { ReactNode } from 'react';
import type { ChatAttachmentProps } from './chat-attachment.props.js';
import { chatAttachmentSchema } from '../../schema/chat-attachment/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChatAttachmentProps } from './chat-attachment.props.js';
export function ChatAttachment(props: ChatAttachmentProps): ReactNode {
  return useDeclaration('ChatAttachment', chatAttachmentSchema, props);
}

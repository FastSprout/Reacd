import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chat-attachment/chat-attachment.adapter.js';
import { SharedChatAttachment } from
  '../../shared/chat-attachment/chat-attachment.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChatAttachmentProps = ComponentProps<typeof SharedChatAttachment>;
export const ShadcnChatAttachment: ComponentType<ShadcnChatAttachmentProps> =
  bindPrimitives(SharedChatAttachment, shadcnPrimitives, 'ShadcnChatAttachment');

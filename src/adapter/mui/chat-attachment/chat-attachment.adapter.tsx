import type { ComponentProps, ComponentType } from 'react';
import { SharedChatAttachment } from
  '../../shared/chat-attachment/chat-attachment.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChatAttachmentProps = ComponentProps<typeof SharedChatAttachment>;
export const MuiChatAttachment: ComponentType<MuiChatAttachmentProps> = bindPrimitives(
  SharedChatAttachment,
  muiPrimitives,
  'MuiChatAttachment',
);

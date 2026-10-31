import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chat-tool/chat-tool.adapter.js';
import { SharedChatTool } from '../../shared/chat-tool/chat-tool.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChatToolProps = ComponentProps<typeof SharedChatTool>;
export const ShadcnChatTool: ComponentType<ShadcnChatToolProps> = bindPrimitives(
  SharedChatTool,
  shadcnPrimitives,
  'ShadcnChatTool',
);

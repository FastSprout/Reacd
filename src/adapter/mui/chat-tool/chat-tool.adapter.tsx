import type { ComponentProps, ComponentType } from 'react';
import { SharedChatTool } from '../../shared/chat-tool/chat-tool.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChatToolProps = ComponentProps<typeof SharedChatTool>;
export const MuiChatTool: ComponentType<MuiChatToolProps> = bindPrimitives(
  SharedChatTool,
  muiPrimitives,
  'MuiChatTool',
);

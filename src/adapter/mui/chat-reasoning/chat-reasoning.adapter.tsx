import type { ComponentProps, ComponentType } from 'react';
import { SharedChatReasoning } from
  '../../shared/chat-reasoning/chat-reasoning.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChatReasoningProps = ComponentProps<typeof SharedChatReasoning>;
export const MuiChatReasoning: ComponentType<MuiChatReasoningProps> = bindPrimitives(
  SharedChatReasoning,
  muiPrimitives,
  'MuiChatReasoning',
);

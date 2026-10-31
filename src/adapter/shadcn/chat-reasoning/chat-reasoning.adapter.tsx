import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chat-reasoning/chat-reasoning.adapter.js';
import { SharedChatReasoning } from
  '../../shared/chat-reasoning/chat-reasoning.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChatReasoningProps = ComponentProps<typeof SharedChatReasoning>;
export const ShadcnChatReasoning: ComponentType<ShadcnChatReasoningProps> =
  bindPrimitives(SharedChatReasoning, shadcnPrimitives, 'ShadcnChatReasoning');

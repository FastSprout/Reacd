import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chat-prompt/chat-prompt.adapter.js';
import { SharedChatPrompt } from '../../shared/chat-prompt/chat-prompt.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChatPromptProps = ComponentProps<typeof SharedChatPrompt>;
export const ShadcnChatPrompt: ComponentType<ShadcnChatPromptProps> = bindPrimitives(
  SharedChatPrompt,
  shadcnPrimitives,
  'ShadcnChatPrompt',
);

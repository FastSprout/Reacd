import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chat-prompt-submit/chat-prompt-submit.adapter.js';
import { SharedChatPromptSubmit } from
  '../../shared/chat-prompt-submit/chat-prompt-submit.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChatPromptSubmitProps = ComponentProps<typeof SharedChatPromptSubmit>;
export const ShadcnChatPromptSubmit: ComponentType<ShadcnChatPromptSubmitProps> =
  bindPrimitives(SharedChatPromptSubmit, shadcnPrimitives, 'ShadcnChatPromptSubmit');

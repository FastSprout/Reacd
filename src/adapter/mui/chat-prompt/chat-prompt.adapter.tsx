import type { ComponentProps, ComponentType } from 'react';
import { SharedChatPrompt } from '../../shared/chat-prompt/chat-prompt.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChatPromptProps = ComponentProps<typeof SharedChatPrompt>;
export const MuiChatPrompt: ComponentType<MuiChatPromptProps> = bindPrimitives(
  SharedChatPrompt,
  muiPrimitives,
  'MuiChatPrompt',
);

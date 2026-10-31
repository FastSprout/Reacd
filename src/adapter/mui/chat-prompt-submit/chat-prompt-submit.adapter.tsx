import type { ComponentProps, ComponentType } from 'react';
import { SharedChatPromptSubmit } from
  '../../shared/chat-prompt-submit/chat-prompt-submit.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChatPromptSubmitProps = ComponentProps<typeof SharedChatPromptSubmit>;
export const MuiChatPromptSubmit: ComponentType<MuiChatPromptSubmitProps> =
  bindPrimitives(SharedChatPromptSubmit, muiPrimitives, 'MuiChatPromptSubmit');

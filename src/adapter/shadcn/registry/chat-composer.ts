import { renderEntry } from '../../../renderer/contracts/render-entry.js';
import { chatPromptSchema } from '../../../schema/chat-prompt/index.js';
import { chatPromptSubmitSchema } from '../../../schema/chat-prompt-submit/index.js';
import { chatPaletteSchema } from '../../../schema/chat-palette/index.js';
import { ShadcnChatPrompt } from '../chat-prompt/chat-prompt.adapter.js';
import {
  ShadcnChatPromptSubmit,
} from '../chat-prompt-submit/chat-prompt-submit.adapter.js';
import { ShadcnChatPalette } from '../chat-palette/chat-palette.adapter.js';

export const chatComposerEntries = {
  ChatPrompt: renderEntry('ChatPrompt', chatPromptSchema, ShadcnChatPrompt),
  ChatPromptSubmit: renderEntry(
    'ChatPromptSubmit',
    chatPromptSubmitSchema,
    ShadcnChatPromptSubmit,
  ),
  ChatPalette: renderEntry('ChatPalette', chatPaletteSchema, ShadcnChatPalette),
} as const;

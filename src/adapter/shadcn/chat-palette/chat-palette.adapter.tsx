import type { ComponentProps, ComponentType } from 'react';
export * from '../../shared/chat-palette/chat-palette.adapter.js';
import { SharedChatPalette } from '../../shared/chat-palette/chat-palette.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { shadcnPrimitives } from '../primitives/primitives.js';

export type ShadcnChatPaletteProps = ComponentProps<typeof SharedChatPalette>;
export const ShadcnChatPalette: ComponentType<ShadcnChatPaletteProps> = bindPrimitives(
  SharedChatPalette,
  shadcnPrimitives,
  'ShadcnChatPalette',
);

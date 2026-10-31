import type { ComponentProps, ComponentType } from 'react';
import { SharedChatPalette } from '../../shared/chat-palette/chat-palette.adapter.js';
import { bindPrimitives } from '../../shared/primitives/context.js';
import { muiPrimitives } from '../primitives/primitives.js';

export type MuiChatPaletteProps = ComponentProps<typeof SharedChatPalette>;
export const MuiChatPalette: ComponentType<MuiChatPaletteProps> = bindPrimitives(
  SharedChatPalette,
  muiPrimitives,
  'MuiChatPalette',
);

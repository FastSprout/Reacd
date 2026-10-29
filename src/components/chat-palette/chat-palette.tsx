import type { ReactNode } from 'react';
import type { ChatPaletteProps } from './chat-palette.props.js';
import { chatPaletteSchema } from '../../schema/chat-palette/index.js';
import { useDeclaration } from '../shared/use-declaration.js';

export type { ChatPaletteProps } from './chat-palette.props.js';
export function ChatPalette(props: ChatPaletteProps): ReactNode {
  return useDeclaration('ChatPalette', chatPaletteSchema, props);
}

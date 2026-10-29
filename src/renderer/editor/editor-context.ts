import { createContext } from 'react';
import type { EditorCommand } from '../../core/editor-commands.js';
import type { EditorDocument, EditorSelection } from '../../core/editor-document.js';
import type {
  EditorBlockMoves,
  EditorMoveDirection,
} from '../../core/editor-reorder.js';

export interface EditorPort {
  readonly document: EditorDocument;
  readonly selection: EditorSelection | undefined;
  readonly selectedBlockId: string | undefined;
  readonly disabled: boolean;
  readonly active: (command: EditorCommand) => boolean;
  readonly available: (command: EditorCommand) => boolean;
  readonly execute: (command: EditorCommand) => void;
  readonly blockMoves: (id: string) => EditorBlockMoves;
  readonly selectBlock: (id: string) => void;
  readonly moveBlock: (id: string, direction: EditorMoveDirection) => void;
  readonly beginBlockDrag: (id: string) => boolean;
  readonly cancelBlockDrag: () => void;
}
export const EditorScopeContext = createContext<EditorPort | null>(null);

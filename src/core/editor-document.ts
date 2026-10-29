import type { EDITOR_CODE_LANGUAGES, EDITOR_MARKS } from './editor-policy.js';

export type EditorMark = (typeof EDITOR_MARKS)[number];
export type EditorCodeLanguage = (typeof EDITOR_CODE_LANGUAGES)[number];
export type EditorInline = Readonly<
  | {
      type: 'text';
      text: string;
      marks?: readonly EditorMark[] | undefined;
      link?: string | undefined;
    }
  | { type: 'mention'; id: string; label: string }
  | { type: 'emoji'; name: string; value: string }
  | { type: 'hardBreak' }
>;

export interface EditorParagraph {
  readonly type: 'paragraph';
  readonly id: string;
  readonly content: readonly EditorInline[];
}
export interface EditorHeading {
  readonly type: 'heading';
  readonly id: string;
  readonly level: 1 | 2 | 3;
  readonly content: readonly EditorInline[];
}
export interface EditorCodeBlock {
  readonly type: 'codeBlock';
  readonly id: string;
  readonly text: string;
  readonly language?: EditorCodeLanguage | undefined;
}
export interface EditorListItem {
  readonly type: 'listItem';
  readonly id: string;
  readonly children: readonly EditorBlock[];
}
export type EditorBlock = Readonly<
  | EditorParagraph
  | EditorHeading
  | EditorCodeBlock
  | { type: 'quote'; id: string; children: readonly EditorBlock[] }
  | { type: 'bulletList'; id: string; items: readonly EditorListItem[] }
  | { type: 'orderedList'; id: string; start: number; items: readonly EditorListItem[] }
  | { type: 'separator'; id: string }
>;

export interface EditorDocument {
  readonly version: 1;
  readonly blocks: readonly EditorBlock[];
}
export interface EditorPosition {
  readonly blockId: string;
  readonly offset: number;
}
export interface EditorSelection {
  readonly anchor: EditorPosition;
  readonly focus: EditorPosition;
}

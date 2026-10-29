export const EDITOR_STANDARD_COMMANDS = [
  'bold',
  'italic',
  'strike',
  'underline',
  'code',
  'heading1',
  'heading2',
  'heading3',
  'paragraph',
  'bulletList',
  'orderedList',
  'quote',
  'codeBlock',
  'separator',
  'removeLink',
  'undo',
  'redo',
] as const;
export type EditorStandardCommand = (typeof EDITOR_STANDARD_COMMANDS)[number];
export type EditorCommandType = EditorStandardCommand | 'link';
export type EditorCommand = Readonly<
  { command: EditorStandardCommand } | { command: 'link'; href: string }
>;

export const EDITOR_COMMAND_LABELS: Readonly<Record<EditorCommandType, string>> = {
  bold: 'Bold',
  italic: 'Italic',
  strike: 'Strikethrough',
  underline: 'Underline',
  code: 'Inline code',
  heading1: 'Heading 1',
  heading2: 'Heading 2',
  heading3: 'Heading 3',
  paragraph: 'Paragraph',
  bulletList: 'Bullet list',
  orderedList: 'Numbered list',
  quote: 'Quote',
  codeBlock: 'Code block',
  separator: 'Insert separator',
  link: 'Apply link',
  removeLink: 'Remove link',
  undo: 'Undo',
  redo: 'Redo',
};
export const EDITOR_DEFAULT_COMMANDS = [
  'bold',
  'italic',
  'heading1',
  'bulletList',
  'undo',
  'redo',
] as const;
export const EDITOR_TOOLBAR_POLICY = {
  minItems: 1,
  maxItems: EDITOR_STANDARD_COMMANDS.length + 1,
} as const;

import { DOCUMENT_POLICY } from './policy.js';

export const EDITOR_POLICY = {
  version: 1,
  maxDepth: 16,
  maxValues: 12_000,
  maxCharacters: 200_000,
  maxBlocks: 256,
  maxChildren: DOCUMENT_POLICY.maxChildren,
  maxInlines: 2_048,
  maxTextLength: 100_000,
  maxEmojiLength: 32,
  maxMarks: 5,
  maxLinksPerText: 1,
  maxOrderedStart: 10_000,
  blockIdPrefix: 'block',
} as const;

export const EDITOR_BLOCK_TYPES = [
  'paragraph',
  'heading',
  'quote',
  'codeBlock',
  'bulletList',
  'orderedList',
  'separator',
  'listItem',
] as const;
export const EDITOR_MARKS = ['bold', 'italic', 'strike', 'underline', 'code'] as const;
export const EDITOR_HEADING_LEVELS = [1, 2, 3] as const;
export const EDITOR_CODE_LANGUAGES = [
  'plain',
  'typescript',
  'javascript',
  'json',
  'python',
  'sql',
  'shell',
] as const;

export const EDITOR_DEFAULTS = {
  disabled: false,
  readOnly: false,
  toolbarLabel: 'Formatting',
  loadingLabel: 'Preparing editor.',
  unavailableInline: 'Unavailable editor content.',
  mentionPrefix: '@',
} as const;
export const EDITOR_BEHAVIOR = {
  automaticInputRules: false,
  autoLink: false,
  linkOnPaste: false,
  openLinks: false,
  loopToolbarFocus: true,
  toolbarDisabledFocusable: false,
  trailingParagraph: false,
} as const;
export const EDITOR_ERRORS = {
  toolbarScope: 'EditorToolbar must be inside an Editor.',
  projection: 'Editor content must use bounded supported blocks, marks and safe links.',
  rejected: 'This edit cannot be represented within the editor content limits.',
  startup: 'Editor could not start. Retry this editor or refresh the view.',
} as const;
export const EDITOR_UNICODE = {
  highSurrogateMin: 0xd800,
  highSurrogateMax: 0xdbff,
  lowSurrogateMin: 0xdc00,
  lowSurrogateMax: 0xdfff,
} as const;

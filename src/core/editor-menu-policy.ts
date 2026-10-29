export const EDITOR_MENU_POLICY = {
  maxItems: 100,
  maxResults: 42,
  maxQuery: 128,
  minItems: 0,
  initialIndex: 0,
  suffix: ' ',
  empty: 'No matching results.',
  loading: 'Loading results.',
  scopeError: 'Editor menus must be inside an Editor.',
  duplicateError: 'Use only one menu of each kind inside an Editor.',
  triggers: { suggestion: '/', mention: '@', emoji: ':' },
} as const;
export const EDITOR_SUGGESTION_COMMANDS = [
  'paragraph',
  'heading1',
  'heading2',
  'heading3',
  'bulletList',
  'orderedList',
  'quote',
  'codeBlock',
  'separator',
] as const;
export type EditorMenuKind = keyof typeof EDITOR_MENU_POLICY.triggers;

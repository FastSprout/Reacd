export const TREE_POLICY = {
  maxNodes: 200,
  maxDepth: 16,
  initialLevel: 1,
  initialPosition: 1,
  singleLimit: 1,
  indentRem: 1,
  maxIndentPercent: 25,
  typeaheadResetMs: 500,
  locale: 'en',
} as const;
export const TREE_DEFAULTS = {
  multiple: false,
  disabled: false,
  selectionReadOnly: false,
  expansionReadOnly: false,
  emptyLabel: 'No items to display.',
} as const;

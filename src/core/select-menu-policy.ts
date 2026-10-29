export const SELECT_MENU_POLICY = {
  singleSelectionCount: 1,
} as const;

export const SELECT_MENU_DEFAULTS = {
  placeholder: 'Choose an option.',
  searchPrefix: 'Search',
  emptyMessage: 'No matching options.',
  loadingMessage: 'Loading options.',
  errorMessage: 'Options could not be loaded.',
  availableMessage: 'options available.',
  clearLabel: 'Clear selection',
  requiredMessage: 'Choose an option before submitting.',
  labelSeparator: ', ',
  validationComplete: 'Selected',
  selectedMark: '✓',
} as const;

export const LISTBOX_MODES = ['single', 'multiple'] as const;
export const LISTBOX_STATUSES = ['ready', 'loading', 'error'] as const;
export const LISTBOX_LOCALES = ['en-US', 'pl-PL', 'de-DE', 'ar-EG'] as const;

export const LISTBOX_DEFAULTS = {
  mode: 'single',
  locale: 'en-US',
  status: 'ready',
  clearLabel: 'Clear selection',
  emptyMessage: 'No options available.',
  loadingMessage: 'Loading options.',
  errorMessage: 'Options could not be loaded.',
  readyMessage: 'Options ready.',
} as const;

export const LISTBOX_POLICY = {
  visibleRows: 8,
  singleLimit: 1,
  imeProcessKeyCode: 229,
  activeTabIndex: 0,
  disabledTabIndex: -1,
  invalidChange: 'Selection change was not accepted.',
  invalidCallback: 'Selection could not be changed. Try again.',
  requiredMessage: 'Select at least one option.',
  validFieldValue: 'selected',
} as const;

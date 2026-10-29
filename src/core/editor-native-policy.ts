export const EDITOR_NATIVE_POLICY = {
  controlledTransaction: 'reacd-controlled',
  nodeOpeningSize: 1,
  dropSplit: 0.5,
  blockAttribute: 'data-reacd-block',
  blockSelector: '[data-reacd-block]',
  retryLabel: 'Retry editor',
  selectionError:
    'Controlled edits require an editable logical selection. This edit was rejected.',
} as const;

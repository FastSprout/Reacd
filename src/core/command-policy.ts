export const COMMAND_FILTERING = ['local', 'external'] as const;
export const COMMAND_POLICY = {
  maximumGroups: 24,
  maximumItemsPerGroup: 100,
  maximumTotalItems: 500,
  maximumResults: 100,
  maximumQueryLength: 1000,
  maximumKeywords: 16,
  listBlockRem: 24,
  descriptionScale: 0.9,
  rank: { exact: 0, prefix: 1, text: 2 },
} as const;
export const COMMAND_DEFAULTS = {
  filtering: 'local',
  status: 'ready',
  emptyMessage: 'No matching commands.',
  loadingMessage: 'Loading commands.',
  errorMessage: 'Commands could not be loaded.',
  invalidSelection: 'Selection callbacks must return a boolean or no value.',
} as const;

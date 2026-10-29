export const CONTENT_SEARCH_DEFAULTS = {
  description: 'Find a document or run a documentation command.',
  buttonLabel: 'Search documentation',
  closeLabel: 'Close search',
  emptyMessage: 'No matching documentation.',
  closeOnSelect: true,
  retainContent: true,
  invalidSelection: 'Selection callbacks must return a boolean or nothing.',
} as const;

export const PAGINATION_SIZES = ['small', 'medium', 'large'] as const;
export const PAGINATION_POLICY = {
  firstIndex: 0,
  displayOffset: 1,
  minimumPages: 1,
  maximumItems: Number.MAX_SAFE_INTEGER,
  maximumSiblings: 2,
  maximumParameterLength: 64,
  relativeOrigin: 'https://reacd.invalid',
  pageParameter: 'page',
  pageSizeParameter: 'pageSize',
} as const;
export const PAGINATION_DEFAULTS = {
  showControls: true,
  showEdges: true,
  siblingCount: 2,
  size: 'medium',
} as const;

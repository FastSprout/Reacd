export const CAROUSEL_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export const CAROUSEL_POLICY = {
  maxItems: 20,
  emptyIndex: 0,
  step: 1,
  minimumNavigationItems: 2,
} as const;
export const CAROUSEL_DEFAULTS = {
  loop: false,
  orientation: 'horizontal',
  state: 'ready',
  emptyMessage: 'No slides available.',
  loadingMessage: 'Loading slides.',
  errorMessage: 'Unable to load slides.',
  previousLabel: 'Previous slide',
  nextLabel: 'Next slide',
  retryLabel: 'Retry slides',
  chooserLabel: 'Choose a slide',
} as const;
export type CarouselOrientation = (typeof CAROUSEL_ORIENTATIONS)[number];
